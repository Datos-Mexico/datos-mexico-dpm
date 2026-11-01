# Auditoría 001 · ReparaCDMX · 1 de noviembre de 2026

**Auditor:** Observatorio Datos México. **Sistema auditado:** ReparaCDMX (adhesión declarada desde el 31 de octubre de
2026; reporta al pulso desde las 22:02 UTC de ese día). **Base:** `PROTOCOLO.md` §8 bis, auditoría del observatorio.
**Periodo auditado:** del 31 de octubre a las 22:00 UTC al 1 de noviembre a las 03:14 UTC (cinco horas y catorce minutos,
toda la vida del reporte hasta el corte). **Acceso:** lectura directa de las tablas internas del sistema (`dpm_resumenes`
y `messages`, esta última sin cuerpos de mensaje ni teléfonos completos) y de las tablas del pulso. El operador del
sistema y el observatorio son la misma persona: esta primera auditoría vale como precedente de método, no como prueba de
independencia, y así se declara.

## Método

1. **Pulso contra sistema.** Se tomaron las 232 cubetas por minuto recibidas por el pulso en el periodo y las 233 de la
   tabla interna del sistema; se compararon diez minutos elegidos al azar con semilla fija (20261101) campo por campo:
   refrescos, primer y último refresco, peor intervalo, entregas y latencia de entrega.
2. **Recálculo desde los registros primarios.** Para el dato por vía de entrega (`respuesta-cliente`) se volvieron a
   calcular, desde la tabla de mensajes y con la misma regla declarada en la ficha (mensaje saliente por Ventas o Soporte
   con un mensaje del mismo cliente en las 24 horas anteriores; se excluyen avisos sin mensaje previo, la línea de prueba
   y los simulados), las entregas y la peor latencia de cada minuto, y se compararon con lo reportado.
3. **Eventos de la fuente.** Se recalcularon, desde la tabla de mensajes, los mensajes entrantes por minuto y su latencia
   entre el instante de Meta y el procesamiento, y se compararon con los `eventos` y `latencia_fuente_max_ms` reportados.
4. **Latido de servidor.** Desde su encendido (1 de noviembre, 00:15 UTC), se verificó que cada minuto de `bandeja`
   tuviera dos refrescos con intervalo de unos 30 segundos.
5. **Puntualidad.** Proporción de cubetas recibidas por el pulso dentro de los cinco minutos del cierre del minuto.

## Resultados

| Prueba | Resultado |
|---|---|
| Pulso contra sistema, 10 minutos al azar | 10 de 10 iguales en todos los campos. La única cubeta que existe solo en el sistema es la del minuto en curso al momento del corte, aún no enviada. |
| Respuesta al cliente recalculada desde mensajes | 37 de 37 cubetas iguales en entregas y en peor latencia. |
| Eventos de la fuente recalculados | 20 de 21 cubetas iguales. **Una difiere**: minuto 00:03 UTC, reportado 1 evento con 5 segundos; el recálculo da 3 eventos y 129 segundos. |
| Latido de servidor | 177 de 178 minutos con dos refrescos; peor intervalo 30.7 segundos. Un minuto (01:02 UTC) con un solo refresco. |
| Puntualidad | 229 de 232 cubetas puntuales (99 %). Las tres tardías son las que la primera corrida recuperó de la hora anterior a su arranque. |
| Comprobación de cara pública (pulso, automática) | Todas las rondas desde las 23:50 UTC coinciden en los siete datos. |

Primer efecto público del periodo: a las 03:10 UTC la bandeja de ReparaCDMX recibió la clase **DPM**, la primera clase
del protocolo, con peor intervalo de 34.5 segundos en la ventana.

## Hallazgos

1. **Eventos atribuidos al minuto equivocado.** El sistema agrupaba los mensajes entrantes por el minuto en que el cliente
   los escribió. Un mensaje que el sistema procesó 129 segundos después ya no entraba en la cubeta de su minuto, que se
   había enviado, y no se reportaba nunca: justo los eventos de latencia alta quedaban fuera de la medida. Es una
   subestimación sistemática de la latencia de la fuente.
2. **La latencia de la fuente incluía procesamiento propio.** El sistema no guardaba cuándo recibió cada mensaje, solo
   cuándo terminó de procesarlo (cola, asistente, reintentos). La «latencia de la fuente» reportada mezclaba Meta con el
   propio sistema. Medida en el periodo: mediana 11 segundos, p90 17 segundos, máximo 129 segundos; cuatro mensajes
   por encima de 60 segundos.
3. **La redeclaración diaria deshacía la elevación del pulso.** El pulso elevó la latencia declarada de 5 a 10 segundos al
   observarla, y la redeclaración automática del catálogo del sistema la devolvió a 5. La regla 0.4 lo permitía; no debía.
4. **Un latido perdido** en 178 minutos. Sin causa identificada; dentro de lo tolerable y registrado.

## Correcciones aplicadas el mismo día

- Sistema: guarda el instante de recepción de cada mensaje entrante antes de procesarlo; atribuye los eventos al minuto en
  que los recibió, con la latencia Meta → recepción; declara como latencia de la fuente la peor medida en las últimas
  24 horas, con piso de 5 segundos.
- Pulso (0.4.1): una redeclaración no puede bajar la latencia de la fuente por debajo de la peor observada en siete días.
- Protocolo (0.4.1): ambos criterios quedaron escritos en `PULSO.md` §4 y §7.5.

## Limitaciones

- Para los datos por vía de consulta no existe un registro primario independiente de la cubeta: el sistema cuenta cada
  consulta directamente en la cubeta, sin bitácora por consulta. La comparación pulso contra sistema prueba que lo enviado
  es lo guardado; no prueba que las consultas ocurrieron. El latido de servidor sí es verificable por su regularidad.
- Operador y auditor son la misma persona. La primera auditoría externa real será la de un sistema que no sea de la casa.

## Recomendaciones

1. Conservar una bitácora muestral de consultas (una de cada cien, sin identificadores) para futuras auditorías de la vía de
   consulta, a costo despreciable.
2. Repetir esta auditoría a la semana, cuando el sistema sea verificable, y publicarla aquí como 002.

## Respuesta del sistema (1 de noviembre de 2026, mismo día)

El operador midió con el instante de recepción: Meta → recepción, mediana 5 s, p90 9 s, máximo 47 s (40 mensajes);
recepción → procesado, mediana 8 s, máximo 10 s. Encontró que cada respuesta del asistente esperaba 120 segundos por diseño,
una ventana de intervención humana que ya no cumplía su función: el cliente recibía la respuesta a los 142 s de mediana y
268 s en p90. Publicó un tope de 40 s por llamada al asistente, una fila por cliente en el consumidor de la cola, una línea
diaria con ambas latencias en su reporte nocturno, y una prueba controlada (una cuarta parte de los clientes a 30 s, el resto a
120 s, dos semanas o más). Sobre los cinco casos de más de un minuto del 31 de octubre: dos audios (transcripción de hasta
45 s), dos ráfagas del mismo cliente y uno de 129 s consistente con un reintento de cola, sin registros para confirmarlo.
El observatorio toma nota: la prueba se verá en el pulso como latencias cercanas a 140 s y el dato seguirá fuera de clase
mientras dure, por decisión del operador; la ficha lo declara.
