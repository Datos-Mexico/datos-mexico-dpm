"""Acumulador de minuto para el Protocolo DPM (Python 3.9+, solo biblioteca estándar).

    a = AcumuladorDpm(sistema="mi-sistema", llave=os.environ["DPM_LLAVE"])
    a.refresco("pedidos", observaciones=2)      # en cada refresco del dato
    a.evento("pedidos", latencia_ms=1800)       # fuente por evento: al recibir cada evento
    a.entrega("respuesta", latencia_ms=8000)    # vía de entrega: al entregar a la persona
    a.enviar_cerrados()                         # una vez por minuto
"""
import json, math, time, urllib.request, urllib.error
from datetime import datetime, timezone

PULSO = "https://api.datosmexico.org/dpm/v1"

def _iso(ms: int) -> str:
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + f"{ms % 1000:03d}Z"

class AcumuladorDpm:
    def __init__(self, sistema: str, llave: str, pulso: str = PULSO):
        self.sistema, self.llave, self.pulso, self.cubetas = sistema, llave, pulso, {}

    def _cubeta(self, dato: str, ahora_ms: int) -> dict:
        minuto = _iso(ahora_ms // 60000 * 60000)
        return self.cubetas.setdefault((dato, minuto), {"dato": dato, "minuto": minuto, "refrescos": 0, "primero": None, "ultimo": None, "intervalo_max_ms": 0, "observaciones": 0, "eventos": 0, "latencia_fuente_max_ms": 0, "entregas": 0, "latencia_entrega_max_ms": 0})

    def refresco(self, dato: str, observaciones: int = 0, ahora_ms: int = None):
        t = ahora_ms or int(time.time() * 1000); c = self._cubeta(dato, t)
        if c["ultimo"] is not None and t > c["ultimo"]: c["intervalo_max_ms"] = max(c["intervalo_max_ms"], t - c["ultimo"])
        if c["primero"] is None: c["primero"] = t
        c["ultimo"] = max(c["ultimo"] or t, t); c["refrescos"] += 1; c["observaciones"] += observaciones

    def evento(self, dato: str, latencia_ms: int, ahora_ms: int = None):
        c = self._cubeta(dato, ahora_ms or int(time.time() * 1000)); c["eventos"] += 1; c["latencia_fuente_max_ms"] = max(c["latencia_fuente_max_ms"], latencia_ms)

    def entrega(self, dato: str, latencia_ms: int, ahora_ms: int = None):
        t = ahora_ms or int(time.time() * 1000); c = self._cubeta(dato, t); c["entregas"] += 1; c["latencia_entrega_max_ms"] = max(c["latencia_entrega_max_ms"], latencia_ms)
        if c["primero"] is None: c["primero"] = t
        c["ultimo"] = max(c["ultimo"] or t, t)

    def enviar_cerrados(self, ahora_ms: int = None):
        t = ahora_ms or int(time.time() * 1000); corte = _iso(t // 60000 * 60000)
        listos = [c for c in self.cubetas.values() if c["minuto"] < corte and (c["refrescos"] > 0 or c["entregas"] > 0)][:1000]
        if not listos: return None
        resumenes = []
        for c in listos:
            n = c["refrescos"]; lapso = c["ultimo"] - c["primero"]
            intervalo = min(max(c["intervalo_max_ms"], math.ceil(lapso / (n - 1))), lapso) if n > 1 else 0
            r = {"dato": c["dato"], "minuto": c["minuto"], "refrescos": n, "primero": _iso(c["primero"]), "ultimo": _iso(c["ultimo"] if (n > 1 or c["entregas"] > 0) else c["primero"]), "intervalo_max_ms": intervalo, "observaciones": c["observaciones"]}
            if c["eventos"] > 0: r.update(eventos=c["eventos"], latencia_fuente_max_ms=round(c["latencia_fuente_max_ms"]))
            if c["entregas"] > 0: r.update(entregas=c["entregas"], latencia_entrega_max_ms=round(c["latencia_entrega_max_ms"]))
            resumenes.append(r)
        req = urllib.request.Request(f"{self.pulso}/resumenes", data=json.dumps({"sistema": self.sistema, "resumenes": resumenes}).encode(), method="POST", headers={"content-type": "application/json", "authorization": f"Bearer {self.llave}"})
        try:
            with urllib.request.urlopen(req, timeout=15) as resp: estado = resp.status
        except urllib.error.HTTPError as e: estado = e.code
        if estado in (200, 404, 422):  # lo rechazado no se reintenta: se corrige hacia adelante
            for c in listos: self.cubetas.pop((c["dato"], c["minuto"]), None)
        return estado
