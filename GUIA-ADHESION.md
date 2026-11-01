# Guía de adhesión: de cero a reportar en una tarde

**Protocolo DPM 0.4 · Observatorio Datos México.** Esta guía lleva a quien opera un sistema, un sitio, una API, una app o
un tablero, desde nada hasta reportar al pulso y ver su dato en datosmexico.org/dpm. No hace falta leer antes el
protocolo completo; cada paso dice lo mínimo y enlaza el detalle.

## 0. Lo que vas a necesitar

- Un sistema que entregue datos a personas y del que puedas decir, por cada dato, cada cuánto lo refrescas.
- Un lugar donde correr un programa cada minuto (un cron, un Worker, una acción programada) con salida a internet.
- Una dirección pública https donde publicar dos números por dato (último refresco y refrescos de la última hora).
- Una llave de reporte, que te entrega el observatorio al registrar tu ficha.

## 1. Pide tu ficha y tu llave

Copia `plantillas/ficha-de-sistema.md`, llénala con honestidad (lo que no sepas, «por declarar») y mándala al observatorio
(contacto en datosmexico.org/contacto) junto con el identificador que quieras para tu sistema: minúsculas, dígitos y guiones,
de 2 a 63 caracteres, por ejemplo `mi-sistema`. Recibirás una llave con la forma `dpm_mi-sistema_…`. **Se muestra una sola
vez** y el pulso guarda solo su huella: guárdala como secreto, nunca en un repositorio. Si se pierde, se emite otra.

Desde ese momento tu sistema aparece en el registro con **adhesión declarada**.

## 2. Declara cada dato

Un dato es un conjunto de observaciones que entregas bajo un nombre: «la bandeja de pedidos», «el tablero de ventas»,
«la respuesta al cliente». Por cada uno, una llamada:

```bash
curl -X PUT https://api.datosmexico.org/dpm/v1/datos/mi-sistema/pedidos \
  -H "authorization: Bearer $DPM_LLAVE" -H "content-type: application/json" \
  -d '{
    "nombre": "Bandeja de pedidos",
    "fuente": "los clientes, al hacer un pedido",
    "fuente_tipo": "evento",
    "latencia_fuente_ms": 3000,
    "via": "consulta",
    "url_comprobacion": "https://mi-sistema.mx/dpm/comprobacion/pedidos",
    "modo": "custodiado",
    "ultima_verificacion": "2026-11-01T12:00:00Z"
  }'
```

Cómo elegir cada campo:

| Campo | Pregunta que responde |
|---|---|
| `fuente_tipo` | ¿La fuente publica por calendario (cada N minutos, cada mes) o cuando algo ocurre (un pedido, un mensaje, una lectura)? `calendario` o `evento`. |
| `reloj_fuente_ms` | Solo calendario: cada cuánto publica la fuente, en milisegundos. Si no lo sabes, `null`, y el dato no podrá tener clase hasta que lo midas. |
| `latencia_fuente_ms` | Solo evento: cuánto tarda, como máximo, un evento en llegar a tu sistema. Es un techo: si el pulso observa más, lo sube él. |
| `via` | ¿La persona consulta el dato (una pantalla que se refresca, una API) o tú se lo llevas cuando ocurre algo (una respuesta, un aviso)? `consulta` o `entrega`. |
| `url_comprobacion` | Dirección pública del paso 5. Sin ella, el dato no puede tener clase. |
| `modo` | `custodiado` si lo almacenas y verificas; `servido` si lo pasas tal cual desde la fuente. |
| `ultima_verificacion` | Última vez que cotejaste el dato contra su fuente. Sin ella, un dato custodiado no cuenta en el caudal. |

Puedes repetir la llamada cuando algo cambie; cada versión queda en el historial del dato.

## 3. Reporta cada minuto

El pulso no quiere cada refresco: quiere, por dato y por minuto cerrado, un resumen. Guarda en tu sistema, por cada
refresco, el instante; al cerrar el minuto manda:

```bash
curl -X POST https://api.datosmexico.org/dpm/v1/resumenes \
  -H "authorization: Bearer $DPM_LLAVE" -H "content-type: application/json" \
  -d '{
    "sistema": "mi-sistema",
    "resumenes": [{
      "dato": "pedidos",
      "minuto": "2026-11-01T18:04:00.000Z",
      "refrescos": 3,
      "primero": "2026-11-01T18:04:02.130Z",
      "ultimo": "2026-11-01T18:04:47.902Z",
      "intervalo_max_ms": 25772,
      "observaciones": 2,
      "eventos": 2,
      "latencia_fuente_max_ms": 1800
    }]
  }'
```

Reglas que el pulso exige (si no se cumplen responde 422 y dice cuál):

- `minuto` truncado al minuto, en UTC, no futuro, de hace menos de 24 horas.
- `primero` y `ultimo` dentro del minuto; con un solo refresco son iguales e `intervalo_max_ms` es 0.
- `intervalo_max_ms` es el mayor hueco entre refrescos consecutivos del minuto: nunca menor que el promedio ni mayor que `ultimo − primero`.
- `eventos` y `latencia_fuente_max_ms` van juntos (fuentes por evento). `entregas` y `latencia_entrega_max_ms` van juntos (vía de entrega), y entonces `refrescos` puede ser 0.
- Un minuto sin refrescos ni entregas **no se reporta**: la ausencia es el dato.
- Hasta 1,000 resúmenes por llamada. Lo que llega dentro de los **cinco minutos** siguientes al cierre del minuto es puntual y cuenta para la clase; lo que llega después cuenta para el historial, no para la clase.

En `ejemplos/reportar.mjs` (Node) y `ejemplos/reportar.py` (Python) hay un acumulador de minuto listo para copiar: le
pasas cada refresco y él arma y manda el resumen.

## 4. Reporta las personas, una vez al día

Después de la 01:00 de la Ciudad de México, cuántas personas distintas recibieron ayer al menos uno de tus datos. Un número,
nunca identificadores:

```bash
curl -X POST https://api.datosmexico.org/dpm/v1/usuarios \
  -H "authorization: Bearer $DPM_LLAVE" -H "content-type: application/json" \
  -d '{ "sistema": "mi-sistema", "fecha": "2026-11-01", "usuarios_distintos": 412, "metodo": "sesiones autenticadas distintas en el día", "datos": ["pedidos"] }'
```

Si cargas universos completos (una ingesta, no un refresco), repórtala en `/dpm/v1/ingestas` con su verificación; alimenta el
caudal de ingesta, que el protocolo muestra separado del de refresco.

## 5. Publica tu dirección de comprobación

Una ruta pública, sin llave, que diga lo mismo que reportas. El pulso la consulta por su cuenta cada diez minutos y publica
si coincide (último refresco a ±5 minutos; refrescos de la última hora a ±20 %). Respuesta esperada:

```json
{ "ultimo_refresco": "2026-11-01T18:04:47.902Z", "refrescos_ultima_hora": 171 }
```

Para un dato por vía de entrega, es la última entrega y las entregas de la hora. Si nunca ha habido refrescos: `null` y `0`.
Tres comprobaciones seguidas que no coincidan sacan al dato de clase. En `ejemplos/comprobacion.mjs` hay una ruta de ejemplo.

## 6. Pon la insignia

```html
<a href="https://datosmexico.org/dpm">
  <img src="https://api.datosmexico.org/dpm/v1/insignia/mi-sistema.svg" alt="Sistema adherido al Protocolo DPM de Datos México" height="20">
</a>
```

La sirve el pulso: dice tu estado y, cuando la tengas, tu clase. No se puede falsear porque no la controlas.

## 7. Qué verás, y cuándo

- Al instante: tu sistema y tus datos en `https://api.datosmexico.org/dpm/v1/sistemas/mi-sistema`, con `ultimo_reporte`
  para confirmar que tu reporte está llegando.
- A los 60 minutos de reportar sin huecos: la primera **clase** del dato (DPM si ningún hueco superó los 60 segundos y la
  cota de la fuente lo permite). Antes dirá «sin ventana».
- A los 7 días civiles reportando cada día: adhesión **verificada**. Desde entonces tus observaciones y tus personas cuentan
  en las cifras públicas del protocolo.
- Siempre: si un minuto falla, la clase se cae y vuelve sola cuando la ventana vuelva a estar limpia. No es un castigo; es la
  medida.

## 8. Errores frecuentes

| Respuesta | Causa habitual |
|---|---|
| `401` | Falta la llave, o es de otro sistema, o el campo `sistema` del cuerpo no es el tuyo. |
| `404` | El dato no está declarado (paso 2). |
| `422 … intervalo_max_ms` | El hueco máximo que mandas no es consistente con `primero`, `ultimo` y `refrescos`. |
| `422 … minuto en el futuro` | Tu reloj adelanta o mandas el minuto en curso: espera a que cierre. |
| clase «fuera de clase» con relojes en regla | Falta `url_comprobacion`, o la cota de la fuente es mayor a un minuto, o tres comprobaciones seguidas no coincidieron: la ficha dice cuál. |

## 9. Lo que el protocolo te pide a cambio

Honestidad en los relojes, una cara pública que diga lo mismo que tu reporte, y aceptar que la clase la fija el pulso. Si el
observatorio te pide una auditoría (una muestra de minutos contra tus registros), la respuesta se publica en tu ficha; negarse
cuesta la adhesión verificada. Todo lo demás, el protocolo lo hace solo.
