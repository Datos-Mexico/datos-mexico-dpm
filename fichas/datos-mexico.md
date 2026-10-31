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
| Clima actual de las 32 capitales estatales (`clima-capitales`) | Open-Meteo | cada 15 minutos (medido: la fuente declara `interval = 900` en cada respuesta) | cada 5 minutos, desde la API del observatorio, un pedido para las 32 capitales | en cada refresco: 32 de 32 respuestas, coordenadas que coinciden, observación fechada en la última hora | custodiado (`api.datosmexico.org/api/v1/clima/actual`); el pronóstico de 16 días que muestra la portada sigue servido desde Open-Meteo | fuera de clase por la cota de la fuente (la fija el pulso) |
| Sismos recientes del SSN (`sismos-ssn`) | Servicio Sismológico Nacional, UNAM (canal RSS) | por evento; latencia de publicación en medición desde el 2026-10-31 (sonda por minuto) | cada minuto, lectura del canal | cada lectura correcta; sismos con origen, lugar y profundidad tal como los publica el SSN | custodiado (`api.datosmexico.org/api/v1/sismos/recientes`) | fuera de clase hasta declarar la latencia medida |
| Series, cubos y tabulados del INEGI, CONSAR, ANUIES y demás fuentes custodiadas | fuente oficial de cada conjunto | mensual, trimestral o anual según el conjunto | manual, sin refresco automático | registrada por conjunto en la bitácora de la API | custodiado | fuera de clase |

## Usuarios

- **Cómo cuenta el sistema a sus usuarios distintos por día:** por declarar (el sitio y la API no reportan hoy un conteo de usuarios distintos por día)
- **Desde cuándo existe ese conteo:** por declarar

## Reporte al pulso

- **Cómo reporta el sistema cada refresco:** la propia API del observatorio reporta por HTTP con su llave, como cualquier sistema adherido: un resumen por refresco del clima (cada 5 minutos) y por lectura de sismos (cada minuto), con el catálogo redeclarado cada hora. Direcciones de comprobación: `/api/v1/clima/comprobacion` y `/api/v1/sismos/comprobacion`
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
