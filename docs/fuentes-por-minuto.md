# ¿Tiene México un dato público que llegue en segundos?

**Investigación abierta del Protocolo DPM · 31 de octubre de 2026, actualizada el 11 de noviembre.** El protocolo presume tres clases: por minuto, por
segundo y por milisegundo. La pregunta operativa es si alguna fuente pública mexicana publica con esa cadencia, porque sin
fuente no hay dato que custodiar. Este documento registra lo medido y lo pendiente; se actualiza con cada medida nueva.

## Lo medido hasta hoy

| Fuente | Qué publica | Cadencia real | Cómo se supo | Consecuencia DPM |
|---|---|---|---|---|
| Open-Meteo (clima de las 32 capitales) | estado actual y pronóstico de modelo | cada 15 minutos | cada respuesta declara `current.interval = 900` | fuente por calendario de 900 s; el dato `datos-mexico/clima-capitales` (pronóstico, no medición) queda fuera de clase aunque se refresque cada 5 minutos |
| SMN, CONAGUA (estaciones meteorológicas automáticas, EMAs) | lecturas cada 10 minutos de 730 estaciones | **ninguna**: medido el 9 de noviembre de 2026, el portal marca las 730 estaciones en error y sus reportes de 24 h, semana y 90 días vienen vacíos | consultas directas a los servicios del portal y vista en navegador | no hay fuente pública de 10 minutos; una sonda diaria lo vigila |
| SMN, CONAGUA (red sinóptica, WIS2 de la OMM) | observación horaria de unos 75 observatorios con personal, en BUFR | cada hora; el lote se publica unos 11 minutos después de la hora (medido el 9 de noviembre de 2026); algunas estaciones llegan tarde | suscripción a los brokers globales de WIS2 y lectura de sus cachés por HTTP | fuente por calendario de 3,600 s: la medición oficial del clima (`datos-mexico/clima-estaciones`) queda fuera de clase por la fuente |
| SENEAM (METAR de aeropuertos, vía aviationweather.gov de NOAA) | reporte horario (minuto 40) y especiales | horaria; NOAA lo tiene unos 16 minutos después de la observación (mediana medida el 9 de noviembre de 2026) | campo `receiptTime` de cada reporte | fuera de clase; el observatorio lo usa solo como testigo de la medición |
| SSN, UNAM (últimos sismos, canal RSS) | cada sismo con su hora de origen | por evento; **medido del 1 al 9 de noviembre de 2026 (275 sismos)**: el canal publica cada sismo entre 12 minutos y 10 horas después de ocurrir; mediana 4 h 27 min, p90 6 h 43 min, mínimo 11 min 40 s | sonda del observatorio: lectura por minuto, instante de origen contra primer instante visto | el canal público del SSN es de sismos ya revisados: no es una fuente por segundo ni por minuto; el dato `datos-mexico/sismos-ssn` queda fuera de clase y la sonda sigue midiendo |
| CENACE (demanda real del sistema eléctrico) | página HTML | no declarada | la página no dice cada cuánto se actualiza | pendiente: localizar el punto de datos que alimenta la página y medir |
| SINAICA, INECC (calidad del aire) | concentración horaria por estación y contaminante, preliminar y sin validar | horaria; **medido el 10–11 de noviembre de 2026**: la mayoría de las redes envía a los :10 de la hora, la de la Ciudad de México a los :31; algunas redes van horas atrás (Monterrey ~3.5 h, Mérida ~4 h esa noche); 11 de las 32 capitales sin estación con envíos | rutas públicas sin sesión (`getUltimosEnvios`, página de estación con 48 h) y marca de tiempo de cada envío | fuera de clase por cota de la fuente; el observatorio la custodia cada hora y calcula el índice de la NOM-172 (coincide con el publicado por SINAICA en 9 de 9 capitales comparables) |
| SMN, CONAGUA (pronóstico por municipio, servicio web) | pronóstico diario a 4 días y horario a 116 h de ~2,460 municipios | **una emisión al día, medido el 10–11 de noviembre de 2026**: la corrida de las 00 UTC aparece entre 11.5 y 12.5 h después (cabecera gzip de las 12:30 UTC el 10-nov; de las 11:30 el 11-nov, ya presente en la revisión de las 12:19); el sitio dice «cada hora 15 minutos», pero el contenido cambia una vez al día: el 11-nov el servidor volvió a comprimir el mismo contenido a las 12:30, con los mismos bytes y otra hora en la cabecera | marca de tiempo de la cabecera gzip de cada archivo (es la hora de compresión, no la de publicación: se acota con la revisión horaria del observatorio, que solo descarga cuando cambia el tamaño) | fuente diaria, fuera de clase; el observatorio guarda cada emisión para medir su acierto contra la medición oficial |
| Banxico, SIE (tipo de cambio FIX) | un valor por día hábil | diaria | publicación oficial | fuera de clase |

## Lo que se concluye por ahora

- No hay, entre lo revisado, una fuente pública mexicana con periodo declarado de un minuto o menos.
- La candidata por evento, los sismos del SSN, **ya tiene número**: su canal público publica cada sismo con horas de retraso
  (mediana 4 h 27 min; el más rápido tardó casi 12 minutos). Es un canal de sismos revisados, no de alerta. No es una fuente
  por segundo ni por minuto.
- El clima tampoco: la red de 10 minutos de CONAGUA no publica, y lo oficial vivo (la red sinóptica del SMN) es horario.
- Mientras tanto, el observatorio reporta sus datos vivos (clima y sismos) con sus cotas reales, y quedan fuera de clase. Eso no
  es una falla del protocolo: es la fotografía honesta de las fuentes públicas del país. Donde sí cabe una clase fina es en lo
  que hace el propio observatorio: la entrega en vivo (`datos-mexico/clima-entrega`), que se mide y se presenta aparte.

## Pendientes

1. Declarar en el catálogo la latencia medida del SSN (máximo observado: 37,064 s) y mantener la sonda como registro
   histórico de latencias del canal.
2. Localizar y medir el punto de datos del CENACE.
3. Revisar otras fuentes por evento con hora de origen pública: alertas del SASMEX, avisos del SMN, incidentes de Metro CDMX.
