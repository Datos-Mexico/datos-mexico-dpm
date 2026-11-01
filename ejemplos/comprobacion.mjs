// Dirección pública de comprobación (protocolo 0.4 §8 bis) como función para un servidor Node/Workers.
// Debe responder, sin llave, { ultimo_refresco: ISO | null, refrescos_ultima_hora: entero } leído de TU registro de refrescos.
// Si el dato va por vía de entrega: última entrega y entregas de la última hora.
export function comprobacion(registro /* [{ instante: ms }], tus refrescos del dato */) {
  const hace1h = Date.now() - 60 * 60_000;
  const recientes = registro.filter((r) => r.instante >= hace1h);
  const ultimo = registro.length ? Math.max(...registro.map((r) => r.instante)) : null;
  return new Response(JSON.stringify({ ultimo_refresco: ultimo === null ? null : new Date(ultimo).toISOString(), refrescos_ultima_hora: recientes.length }), { headers: { "content-type": "application/json", "cache-control": "no-store", "access-control-allow-origin": "*" } });
}
