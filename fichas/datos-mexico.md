# Ficha de sistema · Datos México

## Identidad

- **Nombre del sistema:** Datos México
- **Operador:** Observatorio Datos México
- **Dirección pública:** https://datosmexico.org · https://api.datosmexico.org
- **Qué entrega a las personas:** observatorio académico de datos públicos mexicanos: series, cubos, tabulados y microdatos del INEGI, CONSAR y otras fuentes oficiales, por sitio y por API pública, con verificación al peso contra la fuente.
- **Fecha de adhesión declarada:** 2026-10-31
- **Fecha de adhesión verificada:** por verificar

## Datos que el sistema entrega

| Dato | Fuente | Reloj de la fuente | Reloj del refresco | Última verificación | Modo (servido · custodiado) | Clase |
|---|---|---|---|---|---|---|
| Medición oficial del clima en las 32 capitales (`clima-estaciones`, desde el 2026-11-09) | Servicio Meteorológico Nacional (CONAGUA): la observación sinóptica horaria del observatorio de cada capital, publicada en WIS2 de la OMM y leída de sus cachés globales | cada hora (medido el 2026-11-09: el SMN publica un lote de unas 66 estaciones once minutos después de la hora; algunas llegan tarde) | desde el minuto 8 de cada hora, una consulta por minuto hasta que aparece el lote; luego las 32 de una vez, repasos a los minutos 20, 30 y 45 y en las dos horas siguientes, y relleno de las últimas 23 horas al minuto 50 | en cada lectura: integridad del BUFR (estación y hora pedidas, huella SHA-256, mensaje original guardado), completitud de 32, rangos por los récords mensuales del propio observatorio, salto contra la lectura anterior, lectura repetida y cotejo con el aeropuerto (METAR) | custodiado (`api.datosmexico.org/api/v1/clima/medicion`) | fuera de clase por la cota de la fuente, siempre: la medición es horaria |
| Entrega en vivo del clima (`clima-entrega`, desde el 2026-11-09) | Datos México: el evento es la llegada de cada lectura (medición oficial, aeropuerto o pronóstico) al observatorio; latencia de la fuente 0 por definición | por evento | vía de entrega: las páginas abiertas reciben la lectura empujada por WebSocket y el navegador confirma; la latencia se mide con el reloj del servidor, de la lectura guardada a la confirmación, y solo cuentan las páginas visibles | cada entrega confirmada; las páginas ocultas se cuentan aparte y no entran | custodiado (`api.datosmexico.org/api/v1/clima/entrega`) | la fija el pulso con la peor latencia de la ventana; sin entregas, sin ventana |
| Pronóstico de modelo para las 32 capitales (`clima-capitales`; hasta el 2026-11-09 se llamó «clima actual») | Open-Meteo, agregador de modelos numéricos: no es medición | cada 15 minutos (medido: la fuente declara `interval = 900` en cada respuesta) | cada 5 minutos, un pedido para los 32 puntos de los observatorios | en cada refresco: 32 de 32 respuestas, coordenadas que coinciden, intervalo reciente; además guarda el valor de la hora siguiente, contra el que se calcula el error del modelo | custodiado (`api.datosmexico.org/api/v1/clima/actual`); el pronóstico de 16 días de la portada sigue servido desde Open-Meteo | fuera de clase por la cota de la fuente |
| Sismos recientes del SSN (`sismos-ssn`) | Servicio Sismológico Nacional, UNAM (canal RSS) | por evento; latencia de publicación en medición desde el 2026-10-31 (sonda por minuto) | cada minuto, lectura del canal | cada lectura correcta; sismos con origen, lugar y profundidad tal como los publica el SSN | custodiado (`api.datosmexico.org/api/v1/sismos/recientes`) | fuera de clase hasta declarar la latencia medida |
| Series, cubos y tabulados del INEGI, CONSAR, ANUIES y demás fuentes custodiadas | fuente oficial de cada conjunto | mensual, trimestral o anual según el conjunto | manual, sin refresco automático | registrada por conjunto en la bitácora de la API | custodiado | fuera de clase |

## Cómo se presentan el clima y su entrega

La medición y la entrega son dos datos distintos, con dos relojes distintos, y se presentan juntos y en ese orden, nunca
mezclados: «Medición oficial de hace 4 minutos, fuente cada hora · Entregada por Datos México en 0.3 segundos». La primera
cifra es la antigüedad de una medición ajena que se toma cada hora; la segunda, lo que tardó la salida del observatorio. El
observatorio no dirá «clima por segundo» ni ninguna frase que atribuya a la medición la clase de la entrega: si lo hiciera, el
protocolo entero perdería credibilidad. Si la entrega alcanza la clase por segundo, se dice de la entrega.

Por qué la medición es horaria: CONAGUA tiene una red de estaciones automáticas que publicaba cada 10 minutos, pero su portal
no entrega datos de ninguna de sus 730 estaciones (verificado el 2026-11-09). Una sonda diaria lo vigila
(`api.datosmexico.org/api/v1/clima/sonda-emas`); si vuelve, la medición migra a 10 minutos y la ficha se actualiza.

## Usuarios

- **Cómo cuenta el sistema a sus usuarios distintos por día:** por declarar (el sitio y la API no reportan hoy un conteo de usuarios distintos por día; la entrega en vivo cuenta conexiones y entregas, no personas: contar personas exigiría un identificador anónimo en el navegador, y esa decisión es del CEO)
- **Desde cuándo existe ese conteo:** por declarar

## Reporte al pulso

- **Cómo reporta el sistema cada refresco:** la propia API del observatorio reporta por HTTP con su llave, como cualquier sistema adherido: un resumen por refresco del pronóstico (cada 5 minutos), por lectura de sismos (cada minuto), por cada minuto en que consultó la medición oficial y, para la entrega en vivo, por cada minuto con entregas confirmadas (entregas y peor latencia), con el catálogo redeclarado cada hora. Direcciones de comprobación: `/api/v1/clima/comprobacion`, `/api/v1/clima/comprobacion/estaciones`, `/api/v1/clima/comprobacion/entrega` y `/api/v1/sismos/comprobacion`
- **Cómo reporta el conteo diario de usuarios:** por implementar

## Insignia

- **Dónde muestra el sistema la insignia del protocolo:** página pública del protocolo datosmexico.org/dpm (EN PRODUCCIÓN desde el 31-oct-2026, muestra la insignia de cada sistema adherido) y pie de datosmexico.org (PR #175 del sitio, pendiente de merge). Insignia viva: `https://api.datosmexico.org/dpm/v1/insignia/datos-mexico.svg`

## Compromisos del operador

- [x] declara los tres relojes en cada dato que muestra o sirve (pendiente de implementar donde aún no se muestran);
- [x] reportará al pulso conforme a `PULSO.md`;
- [x] acepta que la clase la fija el reloj y no el operador;
- [x] no presume ninguna cadencia mayor a un minuto con sigla ni insignia;
- [x] no enuncia en público cifras del protocolo que el pulso no haya producido.

Firma del operador: Observatorio Datos México · 2026-10-31
