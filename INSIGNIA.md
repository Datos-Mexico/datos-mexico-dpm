# La insignia

**Protocolo DPM 0.4.0 · 31 de octubre de 2026**

## Qué es

La insignia es la marca visible de adhesión al Protocolo DPM. Un sistema
adherido la muestra en un lugar permanente (pie de página, pantalla de
información, sección «acerca de») con enlace a este repositorio o a la página
del protocolo en datosmexico.org.

## La insignia es viva

La insignia no es una imagen estática. La sirve el pulso:

```
https://api.datosmexico.org/dpm/v1/insignia/{sistema}.svg
```

y muestra lo que el pulso sabe del sistema en ese momento:

| Estado del sistema | Texto de la insignia |
|---|---|
| Adhesión declarada | `Protocolo DPM · adhesión declarada` |
| Adhesión verificada, sin datos en clase | `Protocolo DPM · adhesión verificada` |
| Adhesión verificada, con datos en clase | `Protocolo DPM · DPM` (o `DPS`, o `DPMS`: la clase más fina vigente en el sistema) |

La clase que aparece en la insignia es la que el pulso calculó en su última
evaluación. Si la clase se cae, la insignia cambia en el siguiente minuto. Un
sistema no puede mostrar una clase que no tiene, porque no controla la imagen.

Hasta que el pulso exista, la insignia se muestra en su versión de adhesión
declarada, como imagen estática servida desde este repositorio.

## Cómo se incluye

HTML:

```html
<a href="https://github.com/Datos-Mexico/datos-mexico-dpm">
  <img src="https://api.datosmexico.org/dpm/v1/insignia/repara.svg"
       alt="Sistema adherido al Protocolo DPM de Datos México" height="20">
</a>
```

Markdown:

```markdown
[![Protocolo DPM](https://api.datosmexico.org/dpm/v1/insignia/repara.svg)](https://github.com/Datos-Mexico/datos-mexico-dpm)
```

## Lo que la insignia no dice

No muestra caudal ni usuarios: esas cifras viven en `/dpm/v1/estado` con su
ventana, y la insignia no tiene espacio para una ventana. No muestra ninguna
cadencia mayor a un minuto. No se adapta, recorta ni recolorea: se usa tal
como la sirve el pulso.
