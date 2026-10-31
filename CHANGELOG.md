# Changelog del Protocolo DPM

Todas las versiones del protocolo, con fecha y motivo. Versionado semántico;
hasta la 1.0, cualquier cambio en definiciones, umbrales o reglas de
degradación incrementa la versión menor.

## 0.1.0 · 2026-10-31

Primera formalización pública del protocolo, concebido en anotaciones
manuscritas anteriores a este repositorio.

- Nombre y reserva de siglas: DPM, DPS y DPMS solo para las tres clases; sin
  siglas para cadencias mayores a un minuto.
- Definiciones: observación como unidad de cuenta, dato, fuente, sistema,
  operador, refresco, verificación.
- Los tres relojes: fuente, refresco, verificación.
- Clases por periodo observado entre refrescos: DPM ≤ 60 s, DPS ≤ 1 s,
  DPMS ≤ 1 ms; cota de la fuente.
- Regla de degradación automática: ventana de 60 minutos, peor intervalo,
  sin tolerancia.
- Modos servido y custodiado.
- Dos métricas públicas, caudal (ingesta y refresco por separado) y usuarios
  DPM diarios, producidas únicamente por el pulso.
- Adhesión en dos estados, declarada y verificada; cinco condiciones.
- Registro inicial con cuatro sistemas en adhesión declarada: Datos México,
  Repara, INDEPAR y bpm stream. Cero verificados, cero cifras públicas.

Pendiente para 0.2.0: especificación técnica del pulso (endpoint, formato de
reporte, cálculo de clase) e insignia oficial.
