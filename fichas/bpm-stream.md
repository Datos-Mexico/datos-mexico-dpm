# Ficha de sistema · BPM Stream

## Identidad

- **Nombre del sistema:** BPM Stream
- **Operador:** David Fernando Ávila Díaz
- **Dirección pública:** https://bpm-stream.com
- **Qué entrega a las personas:** agenda, mapa, directorio de DJs y fichas de la escena de música electrónica de todo el mundo, con sede y público en México, para quien va a fiestas y conciertos y sigue a DJs. Sin cuentas de usuario por ahora.
- **Fecha de adhesión declarada:** 2026-10-31
- **Fecha de adhesión verificada:** por verificar
- **En producción desde:** 2026-10-19

## Datos que el sistema entrega

BPM Stream es un sitio estático. Los datos se capturan, se verifican y se
guardan en el repositorio, y el sitio se vuelve a publicar; el navegador baja
los índices una sola vez al cargar y no vuelve a consultar nada. Todos los
datos quedan fuera de clase y se registran aquí con su cadencia en palabras.

| Dato | Fuente | Reloj de la fuente | Reloj del refresco | Última verificación | Modo (servido · custodiado) | Clase |
|---|---|---|---|---|---|---|
| Agenda de eventos (unas 5,674 fechas) | el JSON-LD de un agregador como pista, verificado contra la página de cada boletera | por declarar; solo se lee la fecha de modificación del mapa del sitio del agregador | semanal, los jueves a las 21:17 UTC, por acción programada; incremental, con revisión de lo que tiene más de siete días | en cada corrida, contra la boletera; estado de la corrida registrado en el repositorio | custodiado | fuera de clase |
| Directorio de DJs (919) | el mismo agregador; biografías propias; fotos en almacenamiento propio | por declarar | manual, por importación | por declarar | custodiado | fuera de clase |
| Escena (682 fichas de clubes, recintos, festivales y promotoras) | el mismo agregador | por declarar | manual, por importación | por declarar | custodiado | fuera de clase |
| Capa México (48 lugares y 26 fiestas) | investigación propia, con fuentes y fecha de consulta por ficha | por declarar | manual | fecha de consulta registrada por ficha | custodiado | fuera de clase |

## Usuarios

- **Cómo cuenta el sistema a sus usuarios distintos por día:** no hay mecanismo. El sitio no usa analítica ni rastreo, y su política de cookies lo declara así.
- **Desde cuándo existe ese conteo:** no existe.
- **Cifras documentadas con fecha:** ninguna.

## Reporte al pulso

- **Cómo reporta el sistema cada refresco:** cada corrida buena de la agenda semanal se reporta como ingesta verificada del dato `agenda-eventos` (en producción desde el 31-oct-2026; primera constancia: 5,674 fechas, 2,716 confirmadas, corrida del 20-oct).
- **Cómo reporta el conteo diario de usuarios:** por decidir. Requiere un mecanismo nuevo sin cookies, compatible con la política publicada, por ejemplo analítica agregada del proveedor de alojamiento.

## Insignia

- **Insignia viva:** `https://api.datosmexico.org/dpm/v1/insignia/bpm-stream.svg`
- **Dónde muestra el sistema la insignia del protocolo:** franja inferior del pie de bpm-stream.com (EN PRODUCCIÓN desde el 31-oct-2026, enlaza a datosmexico.org/dpm).

## Compromisos del operador

- [x] declara los tres relojes en cada dato que muestra o sirve (pendiente de implementar donde aún no se muestran);
- [x] reportará al pulso conforme a `PULSO.md`;
- [x] acepta que la clase la fija el reloj y no el operador;
- [x] no presume ninguna cadencia mayor a un minuto con sigla ni insignia;
- [x] no enuncia en público cifras del protocolo que el pulso no haya producido.

Firma del operador: David Fernando Ávila Díaz · 2026-10-31
