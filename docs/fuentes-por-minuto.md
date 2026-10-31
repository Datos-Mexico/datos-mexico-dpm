# ¿Tiene México un dato público que llegue en segundos?

**Investigación abierta del Protocolo DPM · 31 de octubre de 2026.** El protocolo presume tres clases: por minuto, por
segundo y por milisegundo. La pregunta operativa es si alguna fuente pública mexicana publica con esa cadencia, porque sin
fuente no hay dato que custodiar. Este documento registra lo medido y lo pendiente; se actualiza con cada medida nueva.

## Lo medido hasta hoy

| Fuente | Qué publica | Cadencia real | Cómo se supo | Consecuencia DPM |
|---|---|---|---|---|
| Open-Meteo (clima de las 32 capitales) | estado actual y pronóstico | cada 15 minutos | cada respuesta declara `current.interval = 900` | fuente por calendario de 900 s; el dato `datos-mexico/clima-capitales` queda fuera de clase aunque se refresque cada 5 minutos |
| SSN, UNAM (últimos sismos, canal RSS) | cada sismo con su hora de origen | por evento; **latencia de publicación no declarada** | el canal no dice cuándo publicó cada sismo | sonda en marcha: el observatorio lee el canal cada minuto y anota cuándo vio cada sismo nuevo; en una semana habrá mediana, p90 y máximo en `api.datosmexico.org/api/v1/sismos/recientes` |
| CENACE (demanda real del sistema eléctrico) | página HTML | no declarada | la página no dice cada cuánto se actualiza | pendiente: localizar el punto de datos que alimenta la página y medir |
| SINAICA, INECC (calidad del aire) | lecturas por estación | horaria por diseño | naturaleza de la red | fuera de clase por cota de la fuente |
| Banxico, SIE (tipo de cambio FIX) | un valor por día hábil | diaria | publicación oficial | fuera de clase |

## Lo que se concluye por ahora

- No hay, entre lo revisado, una fuente pública mexicana con periodo declarado de un minuto o menos.
- La única candidata a frescura de segundos es **por evento**: los sismos del SSN. La regla 0.3 del protocolo ya sabe medir eso
  (latencia de entrega del evento al sistema). La sonda responderá con número, no con suposición.
- Mientras tanto, el observatorio reporta sus dos datos vivos (clima y sismos) con sus cotas reales, y ambos quedan fuera de
  clase. Eso no es una falla del protocolo: es la fotografía honesta de las fuentes públicas del país.

## Pendientes

1. Una semana de sonda del SSN y declarar la latencia medida en el catálogo (`latencia_fuente_ms`).
2. Localizar y medir el punto de datos del CENACE.
3. Revisar otras fuentes por evento con hora de origen pública: alertas del SASMEX, avisos del SMN, incidentes de Metro CDMX.
