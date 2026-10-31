# Protocolo DPM · Datos Por Minuto

**Versión 0.4.0 · formalizado el 31 de octubre de 2026 · Observatorio Datos México**

## 0. Qué es este documento

Especificación del protocolo DPM, el régimen bajo el cual un sistema declara,
mide y presume la frescura de los datos que entrega a las personas.

Este documento es la primera formalización pública del protocolo. Es
artefacto vivo: se versiona aquí y cada cambio queda en `CHANGELOG.md`.

El protocolo es operativo, no doctrinal. Se rige por el `MANIFESTO.md` y el
`MODELO.md` del repositorio `Datos-Mexico/observatorio`. Donde este protocolo y
esos documentos parezcan divergir, mandan ellos.

---

## 1. Nombre y siglas

El protocolo se llama **Datos Por Minuto**. Sus siglas, **DPM**, comparten
raíz con Datos México, y eso es deliberado.

Las siglas **DPM**, **DPS** y **DPMS** están reservadas a las tres clases del
protocolo (§4) y a nada más. No existen siglas para cadencias mayores a un
minuto. Un dato que se refresca cada hora, cada día, cada mes o cada año se
registra con su cadencia escrita en palabras y no recibe sigla, insignia ni
mención pública como clase.

---

## 2. Definiciones

**Observación.** Un valor, con su fecha de referencia y su fuente. Es la unidad
de cuenta del protocolo. Una serie mensual de diez años son ciento veinte
observaciones; una lectura de temperatura es una observación.

**Dato.** Un conjunto de observaciones que un sistema entrega bajo un mismo
nombre. El protocolo clasifica datos, no observaciones sueltas.

**Fuente.** Quien produce la observación originalmente. El protocolo no la
sustituye ni la corrige.

**Sistema.** Cualquier producto, sitio, API o herramienta que entrega datos a
personas y se adhiere al protocolo (§8).

**Operador.** La persona u organización responsable de un sistema y de lo que
el sistema reporta al pulso (§7).

**Refresco.** El acto de volver a obtener un dato de su fuente. Un refresco
que no trae observaciones nuevas sigue siendo un refresco: lo que se mide es
que el sistema fue a preguntar.

**Verificación.** El cotejo de las observaciones obtenidas contra la fuente,
por conteo, por suma o por identidad. Es la práctica que el Observatorio llama
«al peso».

---

## 3. Los tres relojes

Todo dato bajo el protocolo declara tres relojes, y los declara donde el dato
se muestra o se sirve: en los metadatos de una API, al pie de un gráfico, en
la ficha de un tablero.

1. **Reloj de la fuente.** Cada cuánto la fuente publica observaciones nuevas.
2. **Reloj del refresco.** Cada cuánto el sistema vuelve a obtener el dato.
3. **Reloj de la verificación.** Cuándo fue la última vez que el sistema cotejó
   el dato contra la fuente.

Los tres se declaran aunque el dato quede fuera de toda clase. La declaración
es obligatoria; la clase es consecuencia.

---

## 4. Clases

La clase de un dato se determina por el **periodo observado entre refrescos
consecutivos**, medido por el pulso (§7), no por la configuración que el
operador diga tener.

| Clase | Nombre | Periodo observado entre refrescos |
|---|---|---|
| **DPM** | Datos Por Minuto | menor o igual a 60 segundos |
| **DPS** | Datos Por Segundo | menor o igual a 1 segundo |
| **DPMS** | Datos Por Milisegundo | menor o igual a 1 milisegundo |

Un dato con periodo observado mayor a 60 segundos está **fuera de clase**. Se
registra con su cadencia real y no se presume.

**Cota de la fuente.** Un dato no puede tener una clase más fina que el reloj
de su fuente. Refrescar cada segundo un dato que la fuente publica cada quince
minutos no lo convierte en DPS: su clase queda acotada por la fuente. Esta
regla existe para que la clase describa la frescura real de la observación y
no la insistencia del sistema.

**Fuentes por calendario y fuentes por evento.** Hay dos clases de fuente y
el catálogo declara cuál es cada una:

- Una **fuente por calendario** publica observaciones nuevas con un periodo:
  cada quince minutos, cada mes, cada año. Su reloj es ese periodo y la cota
  se calcula con él.
- Una **fuente por evento** produce una observación cuando algo ocurre: un
  mensaje, una cita, una transacción, la lectura de un sensor. No tiene
  periodo. Su reloj es la **latencia de entrega**: el tiempo entre el instante
  en que la observación ocurre en la fuente y el instante en que el sistema la
  tiene. La cota de una fuente por evento es la peor latencia de entrega
  observada en la ventana; si en la ventana no hubo eventos, es la latencia
  declarada en el catálogo, que el pulso corrige al alza cuando la realidad la
  supera (`PULSO.md` §7).

Una fuente por evento no es una excusa para presumir: un sistema que recibe
los eventos en segundos pero solo vuelve a mirarlos cada hora sigue estando
fuera de clase, porque la clase la fija el peor de los dos relojes.

---

## 5. La etiqueta se cae sola

Ninguna persona asigna la clase de un dato. La asigna el reloj.

- La clase se calcula sobre una **ventana de observación de 60 minutos**.
- Dentro de la ventana, la clase la fija el **peor intervalo** entre refrescos
  consecutivos. Un solo intervalo de 61 segundos saca al dato de DPM durante
  esa ventana.
- La pérdida de clase es inmediata y automática. La recuperación también: en
  cuanto la ventana vuelve a estar dentro del umbral, el dato recupera su clase.
- Un dato que pierde su clase no se oculta: se sigue mostrando con sus tres
  relojes y sin la clase.

La regla es estricta a propósito. Prefiere que la clase aparezca poco y sea
cierta, a que aparezca mucho y sea aproximada. Versiones posteriores podrán
introducir tolerancias si la operación demuestra que hacen falta, y lo harán
con evidencia registrada en el `CHANGELOG.md`.

---

## 6. Dato servido y dato custodiado

El protocolo reconoce dos modos de entregar un dato. Ambos son legítimos y
ambos se declaran.

**Dato servido.** El sistema lo entrega a la persona directamente desde la
fuente, sin almacenarlo ni verificarlo. El sistema es un cristal: lo que la
persona ve es lo que la fuente respondió en ese momento.

**Dato custodiado.** El sistema lo obtiene, lo almacena, lo verifica contra la
fuente y lo entrega desde su propia copia. El sistema responde por él.

Solo el dato custodiado cuenta para el caudal (§7). El dato servido cuenta
para la lista de datos en clase y para los usuarios DPM diarios, siempre
marcado como servido.

**Dos vías para llegar a las personas.** Además del modo, cada dato declara
por qué vía llega a quien lo recibe, porque la frescura se mide distinto:

- **Vía de consulta.** La persona, o el programa que usa, pide el dato una y
  otra vez: una pantalla que se refresca, una API que se consulta. El reloj del
  refresco es el periodo entre consultas consecutivas (§3) y la clase se
  calcula como en §4 y §5.
- **Vía de entrega.** El sistema lleva el dato a la persona cuando ocurre algo,
  sin que ella lo pida: una respuesta en un chat, un aviso, una notificación.
  Aquí no hay periodo entre refrescos; lo que importa es cuánto tardó cada
  entrega desde el evento que la originó hasta que llegó a la persona. El
  reloj del refresco de un dato por entrega es la **peor latencia de entrega**
  de la ventana, medida de extremo a extremo: del instante del evento en la
  fuente al instante en que la persona lo tiene. Con esa medida se le aplican
  los mismos umbrales (§4): DPM si ninguna entrega de la ventana tardó más de
  60 segundos, DPS si ninguna tardó más de un segundo.

Un dato por entrega sin entregas en la ventana no tiene clase que mostrar:
queda **sin ventana**, no fuera de clase, porque no hubo nada que entregar.
Las personas que reciben un dato por entrega cuentan como usuarios DPM
diarios (§7) igual que las que consultan uno.

---

## 7. Métricas públicas y el pulso

El protocolo permite enunciar en público exactamente dos cifras. Las dos las
produce el **pulso**: el mecanismo al que cada sistema adherido reporta sus
refrescos y sus usuarios. Ninguna cifra del protocolo se dice en público si no
la produjo el pulso. Mientras el pulso no exista, no hay cifra que decir.

**Caudal.** Observaciones custodiadas y verificadas que entran a los sistemas
adheridos por minuto. Se reporta siempre en dos renglones separados y nunca
sumados:

- *Caudal de ingesta*: observaciones que entran cuando un operador carga un
  universo completo. Es irregular por naturaleza.
- *Caudal de refresco*: observaciones que entran solas, por el reloj del
  refresco, sin intervención de nadie.

**Usuarios DPM diarios.** Personas distintas que, en un día, recibieron al
menos un dato de clase DPM, DPS o DPMS de un sistema adherido. Cada sistema
reporta su propio conteo, sin identificar a nadie. La cifra pública es la suma
por sistema y se dice así: una persona que usa dos sistemas adheridos cuenta
dos veces. El protocolo no cruza identidades entre sistemas.

**Qué reporta un sistema al pulso.**

- Por cada refresco: sistema, dato, instante del refresco, número de
  observaciones nuevas, modo (servido o custodiado) y, cuando la fuente es por
  evento o la vía es de entrega, la peor latencia medida en ese minuto.
- Por cada día: sistema, fecha, número de usuarios distintos que recibieron al
  menos un dato en clase.

La especificación técnica del pulso, sus rutas, su formato de reporte y el
cálculo exacto de la clase y de las métricas están en `PULSO.md`.

---

## 8. Adhesión

Un sistema está adherido al protocolo cuando cumple cinco condiciones:

1. Declara los tres relojes de cada dato que muestra o sirve (§3).
2. Reporta al pulso sus refrescos y sus usuarios diarios (§7).
3. Acepta que la clase la fija el reloj y no el operador (§5).
4. Tiene ficha en `REGISTRO.md`, con la plantilla de `plantillas/`.
5. Muestra la insignia del protocolo, servida por el pulso, con enlace a este
   repositorio o a la página del protocolo en datosmexico.org (`INSIGNIA.md`).

La adhesión tiene dos estados:

- **Declarada.** El sistema tiene ficha en el registro y su operador se
  compromete con las cinco condiciones, pero el pulso aún no recibe sus
  reportes. Un sistema con adhesión declarada no aporta cifras públicas.
- **Verificada.** El pulso ha recibido al menos un reporte puntual del sistema
  en cada uno de los últimos siete días y sus clases se calculan por reloj.
  Solo los sistemas verificados aportan al caudal y a los usuarios DPM diarios.
  Un sistema que pasa siete días sin reportar vuelve a adhesión declarada.

---

## 8 bis. Comprobación: qué pasa si un sistema miente

El pulso juzga con lo que cada sistema reporta. Un sistema podría reportar
refrescos que no hizo. El protocolo no lo impide con fe: lo hace costoso de
sostener y visible cuando ocurre.

**Comprobación de cara pública.** Todo dato en clase, o que aspire a ella,
declara una **dirección pública de comprobación**: una URL abierta, sin llave,
que responde en todo momento cuándo fue el último refresco de ese dato y
cuántos refrescos hubo en la última hora. El pulso la consulta por su cuenta
desde el observatorio, cada diez minutos, guarda lo que vio con el instante en
que lo vio y lo compara con lo que el sistema reportó:

- **Coincide** cuando el último refresco publicado y el último reportado
  distan menos de cinco minutos, y los refrescos de la última hora publicados
  y reportados no difieren en más de un veinte por ciento.
- **No coincide** cuando cualquiera de las dos cosas falla.
- **Sin respuesta** cuando la dirección no contesta o contesta mal.
- **Sin comprobación** cuando el dato no declaró dirección.

El resultado es público en la ficha del dato, con su historial. Tres
comprobaciones seguidas en «no coincide» o «sin respuesta» sacan al dato de
clase hasta que vuelva a coincidir; la etiqueta se cae también por esto. Un
dato **sin comprobación** no puede estar en clase: puede reportar, puede
mostrar sus relojes, pero la clase exige una cara pública que diga lo mismo.

**Auditoría del observatorio.** Además de la comprobación automática, el
observatorio puede auditar cualquier sistema adherido: pedirle acceso de solo
lectura a sus registros, cotejar una muestra de minutos reportados contra sus
registros internos, y publicar el resultado en la ficha del sistema dentro del
registro, con fecha y método. Un sistema que niegue la auditoría pierde la
adhesión verificada y vuelve a declarada.

**Lo que la comprobación no prueba.** No prueba que el dato sea correcto, ni
que la persona lo haya recibido: prueba que la cara pública del sistema cuenta
lo mismo que su reporte, medido por un tercero que no controla el sistema. Es
una garantía de consistencia, no de verdad. La verdad del dato la gobiernan la
verificación (§3) y las reglas del observatorio.

---

## 9. Lo que el protocolo no es

**No es una promesa de velocidad para todo dato.** La mayor parte de lo que el
Observatorio custodia se publica por mes, por trimestre o por año, y se rige
por las reglas de verificación del Observatorio, no por este protocolo. El
protocolo gobierna el subconjunto de datos que se mueven en minutos o menos.

**No es una medida de calidad.** Un dato en clase DPM que está mal, está mal.
La clase dice cada cuánto se refresca, no si es correcto. La corrección la
gobiernan la verificación y las reglas del Observatorio.

**No es un ranking entre sistemas.** El registro no ordena a los sistemas por
clase ni por caudal.

---

## 10. Versionado

El protocolo sigue versionado semántico. Hasta la versión 1.0, cualquier cambio
en definiciones, umbrales o reglas de degradación incrementa la versión menor.
Cada cambio queda en `CHANGELOG.md` con fecha y motivo. La versión 1.0 se
declarará cuando el pulso lleve al menos un año recibiendo reportes de más de
un sistema verificado.
