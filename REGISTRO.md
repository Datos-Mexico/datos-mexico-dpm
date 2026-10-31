# Registro de sistemas adheridos

Registro público de los sistemas adheridos al Protocolo DPM. Una fila por
sistema; una ficha por sistema en `fichas/`, hecha con la plantilla de
`plantillas/ficha-de-sistema.md`.

El estado de adhesión sigue el §8 del `PROTOCOLO.md`: **declarada** (ficha
registrada, sin reportes al pulso) o **verificada** (el pulso recibe reportes y
calcula las clases por reloj). Mientras un sistema está en estado declarado, la
columna «Datos en clase» dice lo que el operador declara y se marca *por
medir*. Solo el pulso la confirma.

Las cadencias mayores a un minuto se anotan en palabras, en la ficha de cada
sistema, y no aparecen en esta tabla.

## Sistemas

| Sistema | Operador | Adhesión | Estado | Datos en clase (DPM · DPS · DPMS) | Modo | Usuarios diarios | Ficha |
|---|---|---|---|---|---|---|---|
| Datos México · datosmexico.org y api.datosmexico.org | Observatorio Datos México | 2026-10-31 | declarada | ninguno confirmado · el clima de las 32 capitales está declarado en el catálogo del pulso (`datos-mexico/clima-capitales`, servido, reloj de la fuente *por medir*), sin resúmenes aún | servido | sin conteo aún | [ficha](fichas/datos-mexico.md) |
| ReparaCDMX · reparacdmx.com | David Fernando Ávila Díaz | 2026-10-31 | declarada | ninguno confirmado · candidatos: bandeja de mensajes y conversación (WebSocket y consulta cada 15 a 20 s), despacho y ofertas (20 a 30 s), reportes de servicio (60 s); fuentes por evento, regla pendiente en 0.3 (*por medir*) | custodiado | contable desde 2026-06-09; sin reporte al pulso | [ficha](fichas/reparacdmx.md) |
| INDEPAR · indeparmx.org | David Fernando Ávila Díaz | 2026-10-31 | declarada | ninguno: todos los datos son mensuales o anuales y se regeneran a mano | custodiado | analítica agregada desde 2026-10-06; sin reporte al pulso | [ficha](fichas/indepar.md) |
| BPM Stream · bpm-stream.com | David Fernando Ávila Díaz | 2026-10-31 | declarada | ninguno: agenda semanal por acción programada; DJs y escena manuales | custodiado | sin mecanismo; el sitio declara no rastrear | [ficha](fichas/bpm-stream.md) |

## Resumen

| | Cifra |
|---|---|
| Sistemas con adhesión declarada | 4 |
| Sistemas con adhesión verificada | 0 |
| Datos con clase confirmada por el pulso | 0 |
| Cifras públicas disponibles (caudal, usuarios DPM diarios) | ninguna hasta que exista el pulso |

Este resumen se actualiza a mano; la cifra viva está en [api.datosmexico.org/dpm/v1/estado](https://api.datosmexico.org/dpm/v1/estado).
