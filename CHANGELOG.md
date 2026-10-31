# Changelog del Protocolo DPM

Todas las versiones del protocolo, con fecha y motivo. Versionado semántico;
hasta la 1.0, cualquier cambio en definiciones, umbrales o reglas de
degradación incrementa la versión menor.

## 0.2.0 · 2026-10-31

El pulso y la insignia.

- `PULSO.md`: especificación técnica del pulso bajo `api.datosmexico.org/dpm/v1/`.
  Catálogo de datos con cota de la fuente declarada; resumen por minuto como
  unidad de reporte (refrescos, primero, último, peor intervalo,
  observaciones); reportes de ingestas con verificación y de usuarios por día;
  cálculo de clase al cierre de cada minuto sobre ventana de 60 minutos con
  requisito de cobertura, solo con resúmenes puntuales (recibidos dentro de 5
  minutos) y sin reescritura hacia atrás; cálculo de los dos caudales con sus
  ventanas (24 horas y 30 días) y de usuarios DPM diarios del último día
  completo; lecturas públicas; modelo de datos; rechazos.
- `INSIGNIA.md`: la insignia es viva y la sirve el pulso; muestra estado de
  adhesión y, en su caso, la clase más fina vigente; nunca una cadencia mayor a
  un minuto.
- `PROTOCOLO.md` §7 y §8 remiten a los nuevos documentos; la adhesión
  verificada se define por siete días de reportes puntuales y se pierde tras
  siete días de silencio.

## 0.1.0 · 2026-10-31

Primera formalización pública del protocolo.

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
