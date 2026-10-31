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
| Clima actual de las 32 capitales estatales (`clima-capitales`, declarado en el pulso el 2026-10-31) | Open-Meteo | por medir (declarado `null` en el pulso: fuera de clase hasta medirlo) | al cargar la página | sin verificación: dato servido | servido | por medir |
| Series, cubos y tabulados del INEGI, CONSAR, ANUIES y demás fuentes custodiadas | fuente oficial de cada conjunto | mensual, trimestral o anual según el conjunto | manual, sin refresco automático | registrada por conjunto en la bitácora de la API | custodiado | fuera de clase |

## Usuarios

- **Cómo cuenta el sistema a sus usuarios distintos por día:** por declarar (el sitio y la API no reportan hoy un conteo de usuarios distintos por día)
- **Desde cuándo existe ese conteo:** por declarar

## Reporte al pulso

- **Cómo reporta el sistema cada refresco:** el pulso vive en la propia API del Observatorio y está en producción; el reporte de resúmenes del clima está por implementar en el sitio
- **Cómo reporta el conteo diario de usuarios:** por implementar

## Insignia

- **Dónde muestra el sistema la insignia del protocolo:** pie de datosmexico.org y página del protocolo; por implementar. Insignia viva: `https://api.datosmexico.org/dpm/v1/insignia/datos-mexico.svg`

## Compromisos del operador

- [x] declara los tres relojes en cada dato que muestra o sirve (pendiente de implementar donde aún no se muestran);
- [x] reportará al pulso conforme a `PULSO.md`;
- [x] acepta que la clase la fija el reloj y no el operador;
- [x] no presume ninguna cadencia mayor a un minuto con sigla ni insignia;
- [x] no enuncia en público cifras del protocolo que el pulso no haya producido.

Firma del operador: Observatorio Datos México · 2026-10-31
