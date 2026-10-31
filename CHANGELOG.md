# Changelog del Protocolo DPM

Todas las versiones del protocolo, con fecha y motivo. Versionado semántico;
hasta la 1.0, cualquier cambio en definiciones, umbrales o reglas de
degradación incrementa la versión menor.

## 0.2.1 · 2026-10-31

Aclaraciones de `PULSO.md` surgidas al implementar el pulso en
`api.datosmexico.org` (ninguna cambia una regla; todas hacen explícito lo que
la implementación hace):

- §7: el minuto evaluado es `T = minuto en curso − 5 minutos`, por la gracia de
  puntualidad; la clase publicada lleva cinco minutos de retraso y nunca se
  reescribe hacia atrás. Si dos cálculos caen en el mismo `T`, el historial
  conserva el veredicto final de ese `T`.
- §8: el estado de adhesión se evalúa una vez por hora, sobre días civiles
  completos de America/Mexico_City; entre los dos extremos no cambia.
- §2: formato de la llave (`dpm_<sistema>_<48 hex>`), emitida por un
  administrador, mostrada una sola vez; el pulso guarda solo su hash. El
  identificador de sistema tiene de 2 a 63 caracteres.
- §6 y §11: los reportes de usuarios son solo de días completos; una ingesta
  sobre un dato servido se rechaza con `422`.

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
- Registro: las cuatro fichas se completan a partir de los repositorios de
  cada sistema, con nombres públicos corregidos (ReparaCDMX, BPM Stream).
  Resultado honesto: solo ReparaCDMX tiene datos que se refrescan en cadencia
  de minutos; INDEPAR y BPM Stream quedan enteramente fuera de clase.

Pendiente para 0.3.0: regla de cota de la fuente para fuentes por evento
(mensajes, citas, lecturas de sensores), donde el reloj de la fuente no es un
periodo sino una latencia de entrega.

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
