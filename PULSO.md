# El pulso · especificación técnica

**Protocolo DPM 0.2.0 · 31 de octubre de 2026**

## 0. Qué es el pulso

El pulso es el único productor de cifras del Protocolo DPM. Es un servicio
HTTPS que recibe los reportes de los sistemas adheridos, los almacena, calcula
la clase de cada dato por reloj y publica las dos métricas del protocolo. Nada
de lo que el pulso no haya producido se enuncia en público (`PROTOCOLO.md` §7).

El pulso vive dentro de la API del Observatorio, bajo la ruta
`https://api.datosmexico.org/dpm/v1/`. La lectura es pública y sin llave. La
escritura exige la llave de reporte de cada sistema.

Esta especificación define el contrato. La implementación puede cambiar de
infraestructura sin cambiar el contrato; si el contrato cambia, cambia la
versión del protocolo.

---

## 1. Principios del pulso

1. **El sistema reporta, el pulso juzga.** El sistema entrega hechos (cuándo
   refrescó, cuántas observaciones trajo, cuántas personas atendió). La clase,
   el caudal y los usuarios DPM diarios los calcula el pulso, nunca el sistema.
2. **El reloj lo pone el sistema; el pulso lo audita.** Cada reporte lleva el
   instante en que ocurrió el hecho, no el instante en que el pulso lo recibió.
   El pulso guarda ambos.
3. **La clase no se reescribe hacia atrás.** Lo que llega tarde cuenta para la
   historia y para el caudal, pero no cambia una clase ya publicada.
4. **Cifras con ventana.** Toda cifra pública dice sobre qué ventana de tiempo
   se calculó. El pulso nunca publica un número sin su ventana.
5. **Sin personas.** El pulso recibe conteos, nunca identificadores de usuarios.

---

## 2. Identidad y llaves

Cada sistema adherido tiene un **identificador** (`sistema`, slug en minúsculas
con guiones, el mismo de su ficha en `fichas/`) y una **llave de reporte**. La
llave se entrega al operador al registrar la ficha y autoriza a reportar
únicamente sobre su propio sistema. Se envía en la cabecera
`Authorization: Bearer <llave>`.

Cada dato tiene un identificador (`dato`, slug) único dentro de su sistema.

---

## 3. Catálogo de datos

Antes de reportar refrescos de un dato, el sistema lo declara en el catálogo.
El catálogo es la versión legible por máquina de la tabla «Datos que el
sistema entrega» de la ficha.

`PUT /dpm/v1/datos/{sistema}/{dato}`

```json
{
  "nombre": "Clima actual de las 32 capitales estatales",
  "fuente": "Open-Meteo",
  "reloj_fuente_ms": 900000,
  "modo": "servido",
  "ultima_verificacion": "2026-10-31T18:00:00Z"
}
```

| Campo | Tipo | Regla |
|---|---|---|
| `nombre` | texto | Como aparece ante las personas. |
| `fuente` | texto | Quien produce la observación originalmente. |
| `reloj_fuente_ms` | entero o `null` | Periodo con el que la fuente publica observaciones nuevas, en milisegundos. Es la **cota de la fuente** (`PROTOCOLO.md` §4). Si es `null`, el dato no puede recibir clase. |
| `modo` | `servido` · `custodiado` | `PROTOCOLO.md` §6. |
| `ultima_verificacion` | instante ISO 8601 UTC o `null` | Reloj de la verificación. Obligatorio distinto de `null` para datos custodiados que quieran contar en el caudal. |

El catálogo se puede actualizar en cualquier momento. Cada cambio queda en el
historial del dato.

---

## 4. Reporte de refrescos: el resumen por minuto

El pulso no recibe refrescos uno por uno. Recibe, por cada dato y por cada
minuto, un **resumen por minuto**. Un dato DPS produciría 86,400 refrescos al
día y un dato DPMS, millones; el resumen por minuto los representa sin perder
lo único que la clase necesita: el peor intervalo.

`POST /dpm/v1/resumenes`

```json
{
  "sistema": "datos-mexico",
  "resumenes": [
    {
      "dato": "clima-capitales",
      "minuto": "2026-10-31T18:04:00Z",
      "refrescos": 4,
      "primero": "2026-10-31T18:04:02.130Z",
      "ultimo": "2026-10-31T18:04:47.902Z",
      "intervalo_max_ms": 15260,
      "observaciones": 128
    }
  ]
}
```

| Campo | Tipo | Regla |
|---|---|---|
| `minuto` | instante ISO 8601 UTC truncado al minuto | Clave del resumen junto con `sistema` y `dato`. |
| `refrescos` | entero ≥ 1 | Número de refrescos ocurridos dentro del minuto. Un minuto sin refrescos **no se reporta**: la ausencia es el dato. |
| `primero` · `ultimo` | instantes con milisegundos | Instante del primer y del último refresco del minuto. Si `refrescos` es 1, son iguales. |
| `intervalo_max_ms` | entero ≥ 0 | Mayor intervalo entre refrescos consecutivos **dentro** del minuto. Si `refrescos` es 1, vale 0. |
| `observaciones` | entero ≥ 0 | Observaciones nuevas que entraron en el minuto. Un refresco que no trajo nada reporta 0 y sigue siendo refresco. |

Reglas de recepción:

- Un envío puede traer hasta **1,000 resúmenes** de un mismo sistema.
- El pulso guarda, por cada resumen, el instante en que lo recibió
  (`recibido`).
- Un resumen es **puntual** si `recibido` ocurre dentro de los **5 minutos**
  posteriores al fin de su `minuto`. Solo los resúmenes puntuales participan en
  el cálculo de clase. Los demás se guardan como tardíos y cuentan para el
  historial y el caudal.
- Se aceptan resúmenes hasta **24 horas** después de su `minuto`. Después, el
  pulso los rechaza con `422`.
- Un resumen con `minuto` en el futuro se rechaza con `422`.
- Reenviar un resumen con la misma clave lo reemplaza, pero el reemplazo no es
  puntual si el original ya no lo era. Un sistema no puede corregir su pasado
  para ganar clase.
- Un sistema que quiere clase debe reportar **cada minuto**. Reportar por lotes
  cada hora es válido para el historial y el caudal, y deja al dato fuera de
  clase por construcción. Esa es la intención.

---

## 5. Reporte de ingestas

Las cargas de universos completos no pasan por el resumen por minuto. Se
reportan como **ingestas**, porque alimentan el caudal de ingesta, que el
protocolo exige mostrar separado del caudal de refresco.

`POST /dpm/v1/ingestas`

```json
{
  "sistema": "datos-mexico",
  "dato": "bie-series",
  "inicio": "2026-09-14T02:00:00Z",
  "fin": "2026-09-14T09:41:00Z",
  "observaciones": 41250000,
  "verificacion": {
    "metodo": "conteo de series contra el índice de la fuente",
    "resultado": "88678/88678"
  }
}
```

Una ingesta sin `verificacion` se acepta y se guarda, pero **no cuenta en el
caudal**: el caudal es de observaciones verificadas. El dato debe ser
custodiado.

---

## 6. Reporte de usuarios

`POST /dpm/v1/usuarios`

```json
{
  "sistema": "repara",
  "fecha": "2026-10-30",
  "usuarios_distintos": 412,
  "metodo": "sesiones autenticadas",
  "datos": ["reportes-abiertos", "estado-de-atencion"]
}
```

| Campo | Regla |
|---|---|
| `fecha` | Día civil en la zona `America/Mexico_City`, formato `AAAA-MM-DD`. |
| `usuarios_distintos` | Personas distintas que ese día recibieron al menos un dato de los listados en `datos`. Es un conteo, no una lista. |
| `metodo` | Texto corto con el mecanismo de conteo. Se publica tal cual. |
| `datos` | Identificadores de los datos que esas personas recibieron. |

Un reporte por sistema y día. Un segundo reporte para la misma fecha la
reemplaza si llega dentro de los 7 días siguientes; después, se rechaza.

---

## 7. Cálculo de la clase

El pulso evalúa la clase de cada dato **una vez por minuto**, al cierre de cada
minuto `T`, y solo sobre resúmenes puntuales.

1. **Ventana.** Los 60 minutos que terminan en `T`.
2. **Cobertura.** Si el dato no tiene ningún resumen puntual anterior al inicio
   de la ventana, su clase es **sin ventana**: aún no es clasificable. Esto
   evita que un dato recién estrenado reciba clase con cinco minutos de
   historia.
3. **Peor intervalo `W`.** El mayor de:
   - cada `intervalo_max_ms` de los resúmenes en la ventana;
   - cada hueco entre resúmenes consecutivos, `primero` del siguiente menos
     `ultimo` del anterior, incluido el hueco con el último resumen anterior a
     la ventana;
   - el hueco final, `T` menos el `ultimo` más reciente.
   Un minuto ausente dentro de la ventana produce, por construcción, un hueco
   mayor a 60 segundos.
4. **Clase por reloj.** `W ≤ 1 ms` da DPMS; `W ≤ 1,000 ms` da DPS;
   `W ≤ 60,000 ms` da DPM; mayor, fuera de clase.
5. **Cota de la fuente.** Se calcula la clase que correspondería a
   `reloj_fuente_ms` con los mismos umbrales. La clase del dato es la **menos
   fina** de las dos. Si `reloj_fuente_ms` es `null`, el dato queda fuera de
   clase.
6. **Historial.** Si la clase resultante difiere de la vigente, el pulso
   escribe un cambio en el historial del dato con el instante `T`. El historial
   es público y no se edita.

La clase es estricta, sin tolerancia, tal como la fija `PROTOCOLO.md` §5.

---

## 8. Cálculo de las métricas públicas

**Caudal de refresco.** Suma de `observaciones` de los resúmenes de datos
custodiados con `ultima_verificacion` no nula, en las últimas 24 horas,
dividida entre 1,440. Se publica como «observaciones por minuto, últimas 24
horas».

**Caudal de ingesta.** Suma de `observaciones` de las ingestas con
verificación cuyo `fin` cae en los últimos 30 días, dividida entre los minutos
de esos 30 días. Se publica como «observaciones por minuto, últimos 30 días».
Los dos caudales se muestran siempre en renglones separados y nunca se suman.

**Usuarios DPM diarios.** Para una fecha `D`, la suma de `usuarios_distintos`
de los sistemas que, durante `D`, tuvieron en clase al menos uno de los datos
listados en su reporte, según el historial de clases. La cifra pública de
portada es la del **último día completo**, nunca la del día en curso. Se publica
con la leyenda «sumados por sistema».

**Estado de adhesión.** Un sistema pasa a **verificada** cuando el pulso ha
recibido al menos un resumen puntual suyo en cada uno de los últimos 7 días
civiles. Vuelve a **declarada** cuando pasa 7 días sin reportar. El cambio de
estado queda en el historial del sistema.

---

## 9. Lectura pública

Todas las lecturas son públicas, en JSON, con caché de 60 segundos.

| Ruta | Devuelve |
|---|---|
| `GET /dpm/v1/estado` | Versión del protocolo, sistemas con su estado, datos con clase vigente y desde cuándo, los dos caudales con su ventana, usuarios DPM diarios del último día completo, instante de cálculo. |
| `GET /dpm/v1/sistemas/{sistema}` | Ficha legible por máquina, estado de adhesión e historial de estados. |
| `GET /dpm/v1/datos/{sistema}/{dato}` | Catálogo vigente, clase vigente, `W` de la última evaluación y los tres relojes. |
| `GET /dpm/v1/datos/{sistema}/{dato}/historial` | Cambios de clase, con instante. |
| `GET /dpm/v1/usuarios?desde=&hasta=` | Usuarios DPM diarios por fecha y por sistema. |
| `GET /dpm/v1/insignia/{sistema}.svg` | La insignia viva del sistema (`INSIGNIA.md`). |

La respuesta de `/estado` es la única fuente autorizada de las cifras que
aparecen en datosmexico.org, en los sistemas adheridos y en cualquier pieza
pública del protocolo.

---

## 10. Modelo de datos

El pulso se implementa sobre Cloudflare Workers con D1 y un disparador cron por
minuto. Tablas:

| Tabla | Clave | Contenido |
|---|---|---|
| `sistemas` | `sistema` | nombre, operador, estado, fecha de adhesión declarada, hash de la llave. |
| `datos` | `sistema, dato` | catálogo vigente (§3). |
| `datos_historial` | `sistema, dato, desde` | versiones del catálogo. |
| `resumenes` | `sistema, dato, minuto` | resumen por minuto más `recibido` y `puntual`. |
| `ingestas` | `sistema, dato, inicio` | ingestas (§5). |
| `usuarios_dia` | `sistema, fecha` | reporte de usuarios (§6). |
| `clases` | `sistema, dato, desde` | historial de clases (§7). |
| `estados` | `sistema, desde` | historial de estados de adhesión (§8). |

Volumen: un dato en clase genera 1,440 filas de `resumenes` al día. Diez datos
en clase en todos los sistemas adheridos suman unas 432,000 filas al mes. Los
resúmenes de más de 90 días se compactan a una fila por hora en una tabla
`resumenes_hora` con los mismos campos; el historial de clases nunca se
compacta.

---

## 11. Lo que el pulso rechaza

| Situación | Respuesta |
|---|---|
| Llave ausente o de otro sistema | `401` |
| Dato no declarado en el catálogo | `404` |
| Resumen con `minuto` futuro, o de más de 24 horas | `422` |
| `primero` o `ultimo` fuera de su `minuto`, o `ultimo` anterior a `primero` | `422` |
| Más de 1,000 resúmenes en un envío | `413` |
| Reporte de usuarios de una fecha futura o de más de 7 días | `422` |

Un rechazo no se reintenta modificando el hecho. Si el hecho está mal
registrado en el sistema, el sistema corrige su registro hacia adelante.
