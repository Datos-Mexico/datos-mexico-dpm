// Vigilancia externa del pulso del Protocolo DPM. Corre desde GitHub Actions cada diez minutos, fuera de Cloudflare, y abre
// (o cierra) un issue en este repositorio. Qué vigila: que el pulso responda y que haya evaluado clases hace menos de doce
// minutos (evalúa cada minuto con cinco de gracia). Qué NO vigila: si un sistema adherido dejó de reportar; eso lo muestra
// el propio pulso en cada ficha (ultimo_reporte) y es asunto del operador, no del pulso.
//   node tools/vigilancia.mjs            → imprime el diagnóstico y sale con 1 si hay falla
//   GITHUB_TOKEN + GITHUB_REPOSITORY     → además abre/cierra el issue «vigilancia»
const ESTADO = process.env.DPM_ESTADO_URL ?? "https://api.datosmexico.org/dpm/v1/estado";
const MAX_EDAD_MIN = Number(process.env.DPM_MAX_EDAD_MIN ?? 12);
const ETIQUETA = "vigilancia";

async function diagnosticar() {
  const ahora = new Date(); const fallas = []; let e = null;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15_000);
    const r = await fetch(ESTADO, { signal: ctl.signal, headers: { accept: "application/json", "user-agent": "vigilancia-dpm (github actions)" } }).finally(() => clearTimeout(t));
    if (!r.ok) fallas.push(`el pulso respondió ${r.status}`);
    else e = await r.json();
  } catch (err) { fallas.push(`el pulso no respondió: ${String(err).slice(0, 120)}`); }
  if (e) {
    if (!e.instante_evaluado) fallas.push("el pulso nunca ha evaluado clases");
    else {
      const edadMin = (ahora.getTime() - Date.parse(e.instante_evaluado)) / 60_000;
      if (!(edadMin <= MAX_EDAD_MIN)) fallas.push(`última evaluación de clases hace ${Math.round(edadMin)} min (máximo ${MAX_EDAD_MIN})`);
    }
    if (!e.calculado_en || Math.abs(ahora.getTime() - Date.parse(e.calculado_en)) > 10 * 60_000) fallas.push(`calculado_en incoherente: ${e.calculado_en}`);
  }
  const sistemas = (e?.sistemas ?? []).map((s) => `${s.sistema}: ${s.estado}, último reporte ${s.ultimo_reporte ?? "nunca"}, ${s.dias_reportados_7}/7 días`);
  return { ok: fallas.length === 0, fallas, sistemas, version: e?.protocolo?.version ?? null, instante_evaluado: e?.instante_evaluado ?? null, ahora: ahora.toISOString() };
}

async function gh(ruta, init = {}) {
  const repo = process.env.GITHUB_REPOSITORY; const token = process.env.GITHUB_TOKEN;
  const r = await fetch(`https://api.github.com/repos/${repo}${ruta}`, { ...init, headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "content-type": "application/json", "user-agent": "vigilancia-dpm", ...(init.headers ?? {}) } });
  if (!r.ok && r.status !== 404) throw new Error(`GitHub ${r.status} en ${ruta}`);
  return r.status === 204 ? null : r.json();
}

const d = await diagnosticar();
console.log(JSON.stringify(d, null, 1));
if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY) {
  const abiertos = await gh(`/issues?state=open&labels=${ETIQUETA}&per_page=5`);
  const issue = Array.isArray(abiertos) ? abiertos[0] : null;
  const cuerpo = `**${d.ahora}**\n\n${d.ok ? "El pulso responde y evalúa." : d.fallas.map((f) => `- ${f}`).join("\n")}\n\nÚltima evaluación de clases: ${d.instante_evaluado ?? "nunca"} · protocolo ${d.version ?? "?"}\n\nSistemas:\n${d.sistemas.map((s) => `- ${s}`).join("\n")}\n\nVigilancia externa desde GitHub Actions (tools/vigilancia.mjs). El estado vivo: ${ESTADO}`;
  if (!d.ok && !issue) {
    await gh("/issues", { method: "POST", body: JSON.stringify({ title: `Vigilancia: el pulso no está evaluando (${d.ahora.slice(0, 16)}Z)`, body: cuerpo, labels: [ETIQUETA] }) });
    console.log("issue abierto");
  } else if (!d.ok && issue) {
    await gh(`/issues/${issue.number}/comments`, { method: "POST", body: JSON.stringify({ body: `Sigue fallando.\n\n${cuerpo}` }) });
    console.log(`issue #${issue.number} actualizado`);
  } else if (d.ok && issue) {
    await gh(`/issues/${issue.number}/comments`, { method: "POST", body: JSON.stringify({ body: `Recuperado.\n\n${cuerpo}` }) });
    await gh(`/issues/${issue.number}`, { method: "PATCH", body: JSON.stringify({ state: "closed" }) });
    console.log(`issue #${issue.number} cerrado`);
  }
}
process.exit(d.ok ? 0 : 1);
