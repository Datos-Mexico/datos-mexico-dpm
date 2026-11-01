// Acumulador de minuto para el Protocolo DPM (Node 18+ / Cloudflare Workers / Deno). Sin dependencias.
// Uso: const a = new AcumuladorDpm({ sistema: "mi-sistema", llave: process.env.DPM_LLAVE });
//      a.refresco("pedidos", { observaciones: 2 });            // en cada refresco del dato
//      a.evento("pedidos", latenciaMs);                         // si la fuente es por evento: al recibir cada evento
//      a.entrega("respuesta", latenciaMs);                      // si la vía es de entrega: al entregar a la persona
//      setInterval(() => a.enviarCerrados(), 60_000);           // una vez por minuto: manda los minutos ya cerrados
export class AcumuladorDpm {
  constructor({ sistema, llave, pulso = "https://api.datosmexico.org/dpm/v1", fetchImpl = fetch }) {
    this.sistema = sistema; this.llave = llave; this.pulso = pulso; this.fetch = fetchImpl; this.cubetas = new Map();
  }
  #cubeta(dato, ahora) {
    const minuto = new Date(Math.floor(ahora / 60_000) * 60_000).toISOString(); const k = `${dato}|${minuto}`;
    if (!this.cubetas.has(k)) this.cubetas.set(k, { dato, minuto, refrescos: 0, primero: null, ultimo: null, intervalo_max_ms: 0, observaciones: 0, eventos: 0, latencia_fuente_max_ms: 0, entregas: 0, latencia_entrega_max_ms: 0 });
    return this.cubetas.get(k);
  }
  refresco(dato, { observaciones = 0, ahora = Date.now() } = {}) {
    const c = this.#cubeta(dato, ahora);
    if (c.ultimo !== null && ahora > c.ultimo) c.intervalo_max_ms = Math.max(c.intervalo_max_ms, ahora - c.ultimo);
    if (c.primero === null) c.primero = ahora; c.ultimo = Math.max(c.ultimo ?? ahora, ahora); c.refrescos++; c.observaciones += observaciones;
  }
  evento(dato, latenciaMs, ahora = Date.now()) { const c = this.#cubeta(dato, ahora); c.eventos++; c.latencia_fuente_max_ms = Math.max(c.latencia_fuente_max_ms, latenciaMs); }
  entrega(dato, latenciaMs, ahora = Date.now()) { const c = this.#cubeta(dato, ahora); c.entregas++; c.latencia_entrega_max_ms = Math.max(c.latencia_entrega_max_ms, latenciaMs); if (c.primero === null) c.primero = ahora; c.ultimo = Math.max(c.ultimo ?? ahora, ahora); }
  /** Manda al pulso los minutos ya cerrados y los borra de memoria. Devuelve el estado HTTP (o null si no había nada). */
  async enviarCerrados(ahora = Date.now()) {
    const corte = new Date(Math.floor(ahora / 60_000) * 60_000).toISOString();
    const listos = [...this.cubetas.values()].filter((c) => c.minuto < corte && (c.refrescos > 0 || c.entregas > 0));
    if (listos.length === 0) return null;
    const resumenes = listos.slice(0, 1000).map((c) => {
      const lapso = c.ultimo - c.primero; const n = c.refrescos;
      const intervalo = n > 1 ? Math.min(Math.max(c.intervalo_max_ms, Math.ceil(lapso / (n - 1))), lapso) : 0;
      return {
        dato: c.dato, minuto: c.minuto, refrescos: n, primero: new Date(c.primero).toISOString(), ultimo: new Date(n > 1 || c.entregas > 0 ? c.ultimo : c.primero).toISOString(), intervalo_max_ms: intervalo, observaciones: c.observaciones,
        ...(c.eventos > 0 ? { eventos: c.eventos, latencia_fuente_max_ms: Math.round(c.latencia_fuente_max_ms) } : {}),
        ...(c.entregas > 0 ? { entregas: c.entregas, latencia_entrega_max_ms: Math.round(c.latencia_entrega_max_ms) } : {}),
      };
    });
    const r = await this.fetch(`${this.pulso}/resumenes`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${this.llave}` }, body: JSON.stringify({ sistema: this.sistema, resumenes }) });
    if (r.ok || r.status === 422 || r.status === 404) for (const c of listos) this.cubetas.delete(`${c.dato}|${c.minuto}`); // lo rechazado no se reintenta: se corrige hacia adelante
    return r.status;
  }
}
