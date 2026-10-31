# Ficha de sistema · ReparaCDMX

## Identidad

- **Nombre del sistema:** ReparaCDMX
- **Operador:** David Fernando Ávila Díaz
- **Dirección pública:** https://reparacdmx.com · consola de operación en consola.reparacdmx.com · canal principal por WhatsApp · apps móviles «ReparaCDMX» (clientes) y «ReparaCDMX Técnicos» en pruebas cerradas, sin publicar en tiendas
- **Qué entrega a las personas:** servicio de reparación de electrodomésticos a domicilio en la Ciudad de México. Los clientes cotizan y agendan por WhatsApp con un asistente; los técnicos y operadores usan la app y la consola para agenda, despacho, órdenes y cobro.
- **Fecha de adhesión declarada:** 2026-10-31
- **Fecha de adhesión verificada:** por verificar
- **En producción con clientes reales desde:** 2026-08-10

## Datos que el sistema entrega

Los datos de ReparaCDMX nacen por evento (un mensaje, una cita, una oferta),
no por calendario. Desde el protocolo 0.3 se declaran como **fuente por
evento**: su cota es la latencia de entrega del evento al sistema, que el
sistema mide y reporta por minuto. Los datos que llegan a las personas por
WebSocket o en el chat se declaran además por **vía de entrega**. ReparaCDMX
reporta al pulso desde el 31 de octubre de 2026 (vía de consulta); el reporte
de latencias está por implementar y hasta entonces la columna «Clase» dice
*por medir*.

| Dato | Fuente | Reloj de la fuente | Reloj del refresco | Última verificación | Modo (servido · custodiado) | Clase |
|---|---|---|---|---|---|---|
| Bandeja de mensajes de clientes (consola) | clientes, vía Meta Cloud API | por evento; entrega en segundos | WebSocket en vivo con vigilante de 45 segundos; consulta de respaldo cada 20 segundos | firma HMAC e idempotencia en cada entrada | custodiado | por medir |
| Conversación abierta (consola) | clientes, vía Meta Cloud API | por evento | WebSocket; consulta de respaldo cada 15 segundos | ídem | custodiado | por medir |
| Despacho y ofertas a técnicos | el sistema y los técnicos | por evento | cada 20 segundos (despacho y compuerta de ofertas); cada 30 segundos (ofertas en la app) | ídem | custodiado | por medir |
| Reportes de servicio | técnicos | por evento | cada 60 segundos | ídem | custodiado | por medir |
| Chat de la app móvil | clientes y operadores | por evento | WebSocket con latido cada 25 segundos; consulta cada 8 segundos en la pantalla de chat y cada 20 segundos en la bandeja | ídem | custodiado | por medir |
| Citas y agenda | el asistente, los operadores y Google Calendar | por evento | cada 120 segundos; revisión del servidor cada 20 minutos | ídem | custodiado | fuera de clase |
| Ubicación de técnicos | GPS del dispositivo | continuo | latido cada 15 minutos; revisión cada 60 segundos; presencia cada 5 minutos | sin verificación externa | custodiado | fuera de clase |
| Finanzas (Meta Ads, cobros, tipo de cambio, consumo de proveedores) | Meta Ads, buzón de cobros, proveedores | diaria u horaria según la fuente | cada hora; dos veces al día; una vez al día | conciliación en el propio módulo | custodiado | fuera de clase |

## Usuarios

- **Cómo cuenta el sistema a sus usuarios distintos por día:** contactos distintos con actividad en el día en la tabla de eventos de analítica y en la de mensajes; técnicos y operadores distintos por presencia en la app y en la consola. Conteos sin identificar a nadie.
- **Desde cuándo existe ese conteo:** eventos de analítica desde 2026-06-09; presencia de operadores desde 2026-09-18; presencia de técnicos desde 2026-09-22.
- **Cifras documentadas en el repositorio del sistema, con su fecha:** 52 clientes escribieron el 2026-10-24; 17 técnicos activos al 2026-10-21. Estas cifras son del operador, no del pulso, y no se enuncian como cifras del protocolo.

## Reporte al pulso

- **Cómo reporta el sistema cada refresco:** por implementar. Lugar natural: el manejador programado del Worker del webhook y el manejador de entrada del webhook.
- **Cómo reporta el conteo diario de usuarios:** por implementar. Lugar natural: el cron diario ya existente de la API de la app.

## Insignia

- **Insignia viva:** `https://api.datosmexico.org/dpm/v1/insignia/reparacdmx.svg`
- **Dónde muestra el sistema la insignia del protocolo:** pie del sitio público; pantalla «Cuenta» de la app de clientes junto al aviso de privacidad; pantalla «Perfil» de la app de técnicos. Por implementar.

## Compromisos del operador

- [x] declara los tres relojes en cada dato que muestra o sirve (pendiente de implementar donde aún no se muestran);
- [x] reportará al pulso conforme a `PULSO.md`;
- [x] acepta que la clase la fija el reloj y no el operador;
- [x] no presume ninguna cadencia mayor a un minuto con sigla ni insignia;
- [x] no enuncia en público cifras del protocolo que el pulso no haya producido.

Firma del operador: David Fernando Ávila Díaz · 2026-10-31
