# Auditoría 002 · Datos México, clima oficial · 10 de noviembre de 2026

**Auditor:** Observatorio Datos México. **Sistema auditado:** Datos México, datos `clima-estaciones` (medición oficial del
SMN en las 32 capitales, cada hora) y `clima-entrega` (entrega en vivo de cada lectura al navegador), declarados el 9 de
noviembre de 2026 a las 19:09 UTC. **Base:** `PROTOCOLO.md` §8 bis, auditoría del observatorio. **Periodos:** reporte al
pulso, del 9 de noviembre a las 19:09 UTC al 10 de noviembre a las 04:59 UTC (toda la vida del reporte hasta el corte);
medición al peso, las 24 horas anteriores al 10 de noviembre a las 05:00 UTC. **Acceso:** lectura (solo consultas SELECT) de
las tablas del pulso (`resumenes`, `comprobaciones`, `clases`) y del sistema (`clima_consultas`, `clima_medicion`,
`clima_lotes`), y de sus caras públicas. Operador y auditor son la misma casa: como en la 001, vale como método, no como
prueba de independencia.

## Método

1. **Medición al peso.** Cada observación publicada en la API se comparó con un caché de la OMM distinto del que usó el
   observatorio: bytes idénticos y huella SHA-256 publicada; cada valor se volvió a decodificar con ecCodes (ECMWF), un
   decodificador independiente del sistema; las marcas de calidad se recalcularon con las reglas publicadas; y en cada hora
   incompleta se buscó en el caché lo que falta. Script: `scripts/clima/auditar.py` (repositorio de la API).
2. **Pulso contra sistema, medición.** Cada minuto en que el sistema consultó al SMN (bitácora `clima_consultas`) debe tener
   su resumen en el pulso, con un refresco; las observaciones reportadas se recalcularon desde `clima_medicion`. Se
   compararon todos los minutos, no una muestra.
3. **Custodia.** De que el caché de la OMM publica cada medición (su Last-Modified, la mejor señal disponible de cuándo la
   publicó el SMN) a que el sistema la tiene verificada y guardada, para las mediciones que llegaron en su hora.
4. **Entrega en vivo.** Entregas y peor latencia de las últimas 24 horas según el pulso, contra las cifras que el componente de
   entrega calcula desde su propio registro y publica en `/api/v1/clima/entrega`.
5. **Puntualidad, comprobación y clases.** Resúmenes recibidos dentro de los cinco minutos del cierre; todas las rondas de
   comprobación de cara pública; todos los cambios de clase. Script de los pasos 2 a 5: `scripts/clima/auditar_pulso.py`.

## Resultados

| Prueba | Resultado |
|---|---|
| Medición al peso (24 h) | **698 de 698** mediciones: huella SHA-256 igual, bytes iguales a otro caché de la OMM, valores iguales a ecCodes y marcas recalculadas iguales. |
| Horas incompletas | 23 horas revisadas; **0** lecturas faltantes que sí estuvieran en el caché de la OMM: lo que falta no llegó a la OMM. |
| Pulso contra sistema, medición | **91 de 91** minutos con consulta tienen su resumen y no hay resúmenes sin consulta; refrescos y observaciones iguales en los 91. |
| Custodia (311 mediciones en su hora) | De la publicación en la OMM a guardada y verificada: mediana **17 s**, p95 71 s, máximo 76 s. De la hora de observación a guardada: mediana 11.4 min, máximo 28 min. |
| Entrega en vivo, 24 h | Pulso y componente de entrega coinciden: **35** entregas a páginas visibles, peor latencia **1.46 s** en ambos. Mediana 0.59 s, p95 1.09 s. |
| Puntualidad | **124 de 124** resúmenes puntuales. |
| Comprobación, medición | **59 de 59** rondas coinciden. |
| Comprobación, entrega | **55 de 59** coinciden; **4 no coinciden** (hallazgo 1). Nunca tres seguidas: sin efecto en la clase. |
| Clases, entrega | DPS de 19:16 a 19:48 y de 20:58 a 21:31 UTC del día 9, de 00:01 a 02:16 y de 02:29 a 04:03 UTC del día 10; DPM de 19:48 a 20:58; sin ventana en el resto (nadie con la página a la vista). |
| Clase, medición | Fuera de clase desde las 20:10 UTC del día 9, por la fuente (el SMN publica cada hora), como se declaró. |

## Hallazgos

1. **La cara pública de la entrega contaba el minuto en curso.** `/api/v1/clima/comprobacion/entrega` incluía entregas de
   minutos que aún no se podían reportar (el resumen se envía al cerrar el minuto). Con entregas espaciadas, la última vista
   quedaba más de cinco minutos adelante de la última reportada y la ronda no coincidía. Ocurrió en 4 de 59 rondas
   (00:00, 01:00, 02:50 y 03:00 UTC del día 10). No hubo dato falso: es un desfase de la ventana de la cara pública.
2. **La clase de la entrega depende de que alguien mire.** Sin páginas a la vista no hay entregas que medir y el dato queda
   sin ventana, como de 21:31 a 00:01 y desde las 04:03 UTC. La portada del sitio mostraba el mapa del clima sin conectarse
   a la entrega en vivo, así que sus visitas no contaban.
3. **Huecos del SMN.** En las últimas 24 horas llegaron 722 de 768 lecturas (94 %) y solo 2 de 24 horas tuvieron las 32
   capitales; Guadalajara no se publica desde la 01:00 UTC del día 10. El sistema lo dice hora por hora; ninguna faltante
   estaba en la OMM.

## Corrección

- Sistema: la cara pública de la entrega cuenta solo minutos cerrados hace más de dos minutos, que ya están reportados
  (`src/clima/envivo.ts`, PR #16 de la API). Preparada el mismo día; se aplica con el visto bueno del responsable del sistema y se anotará aquí
  la hora en que quedó en producción.
- Sistema: la portada se conecta a la entrega en vivo (hallazgo 2), en preparación.

## Limitaciones

- El registro primario de la entrega vive dentro del componente de entrega y no tiene vía de lectura externa: se comparó el
  pulso contra el agregado que publica el componente, dos caminos distintos desde el mismo registro, no contra el registro
  mismo.
- La visibilidad de la página la informa el navegador; una página que mienta sobre su visibilidad no se puede distinguir.
- La hora de publicación del SMN se aproxima con el Last-Modified del caché de la OMM.
- El periodo del pulso es de diez horas, casi todas de noche en México.

## Recomendaciones

1. Publicar de solo lectura los minutos de la entrega (minuto, entregas, ocultas, peor latencia; sin datos de visitantes) para
   recalcular la entrega desde su registro en la próxima auditoría.
2. Repetir esta auditoría a la semana, con días completos y la portada ya conectada, y publicarla como 003.
3. Pedir al SMN, con estas cifras, la causa de los huecos de Guadalajara y Colima.
