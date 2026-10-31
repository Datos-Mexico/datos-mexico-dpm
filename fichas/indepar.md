# Ficha de sistema · INDEPAR

## Identidad

- **Nombre del sistema:** INDEPAR · Instituto de Estrategia Integral para el Retiro
- **Operador:** David Fernando Ávila Díaz
- **Dirección pública:** https://indeparmx.org · app «INDEPAR Cerca» en pruebas (TestFlight y prueba interna de Android), sin publicar en tiendas
- **Qué entrega a las personas:** estudios «Panorama del SAR» 1997-2025, un conjunto de datos abierto por AFORE, diez calculadoras de retiro y contenidos de salud y propósito, para personas adultas en México que planean su retiro. Además, comunidad y membresía con talleres y eventos.
- **Fecha de adhesión declarada:** 2026-10-31
- **Fecha de adhesión verificada:** por verificar
- **En producción desde:** junio de 2026

## Datos que el sistema entrega

Todos los datos de INDEPAR son estáticos: se generan con el motor del
proyecto, se validan contra su insumo y se publican con el despliegue. Ningún
dato se refresca solo. Todos quedan fuera de clase y se registran aquí con su
cadencia en palabras.

| Dato | Fuente | Reloj de la fuente | Reloj del refresco | Última verificación | Modo (servido · custodiado) | Clase |
|---|---|---|---|---|---|---|
| 29 estudios «Panorama del SAR» (recursos, cuentas, comisiones, rendimientos) | CONSAR, vía el SDK de Datos México, más archivos propios del operador | mensual | manual, con regeneración por el motor; última regeneración 2026-06-29 | validador del motor contra el insumo de cada estudio, con marcas por cifra de verificado o estimado; cobertura verificada hasta 2025-12 | custodiado | fuera de clase |
| Conjunto de datos INDEPAR-DATA-001 (mensual por AFORE: comisión, cuentas, RCV, recursos) | CONSAR | mensual | manual; archivo del 2026-06-22 con última fila 2025-06 | ídem | custodiado | fuera de clase |
| Parámetros de las calculadoras (UMA, salario mínimo, comisión promedio, cuota social, pensión garantizada) | INEGI, CONASAMI, CONSAR, Ley del Seguro Social | anual, trimestral o anual según el parámetro | manual, por edición y despliegue; vigencia de supuestos 2026 | bloque «Datos oficiales vigentes usados» en cada calculadora | custodiado | fuera de clase |

## Usuarios

- **Cómo cuenta el sistema a sus usuarios distintos por día:** en la web, Cloudflare Web Analytics sin cookies, con cifras agregadas; en la app, tablas de usuarios y sesiones con último acceso, que dan altas por día y último uso, pero no un histórico de usuarios distintos por día.
- **Desde cuándo existe ese conteo:** web desde 2026-10-06; app desde sus migraciones iniciales.
- **Cifras documentadas con fecha:** ninguna.

## Reporte al pulso

- **Cómo reporta el sistema cada refresco:** por implementar. Como no hay refresco automático, el lugar natural es el script de despliegue, que reportaría cada regeneración como ingesta con su verificación.
- **Cómo reporta el conteo diario de usuarios:** por implementar. Lugar natural: un cron adicional en los Workers que ya leen la base D1 del sistema.

## Insignia

- **Dónde muestra el sistema la insignia del protocolo:** pie común del sitio; alternativas: la página de estándares, la página de datos o el bloque de datos oficiales de cada calculadora. Por implementar.

## Compromisos del operador

- [x] declara los tres relojes en cada dato que muestra o sirve (pendiente de implementar donde aún no se muestran);
- [x] reportará al pulso conforme a `PULSO.md`;
- [x] acepta que la clase la fija el reloj y no el operador;
- [x] no presume ninguna cadencia mayor a un minuto con sigla ni insignia;
- [x] no enuncia en público cifras del protocolo que el pulso no haya producido.

Firma del operador: David Fernando Ávila Díaz · 2026-10-31
