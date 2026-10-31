# Datos-Mexico/datos-mexico-dpm

[![Sitio: datosmexico.org](https://img.shields.io/badge/sitio-datosmexico.org-111111)](https://datosmexico.org)
[![Licencia: CC BY 4.0](https://img.shields.io/badge/licencia-CC%20BY%204.0-lightgrey)](LICENSE)
[![Protocolo: 0.1.0](https://img.shields.io/badge/protocolo-0.4.0-blue)](CHANGELOG.md)
[![Sistemas adheridos: 4 declarados · 0 verificados](https://img.shields.io/badge/sistemas%20adheridos-4%20declarados%20%C2%B7%200%20verificados-lightgrey)](REGISTRO.md)

Sede del **Protocolo DPM · Datos Por Minuto** del Observatorio Datos México:
el régimen bajo el cual un sistema declara, mide y presume la frescura de los
datos que entrega a las personas.

Tres clases, y solo tres, se presumen: **DPM** (refresco cada minuto o menos),
**DPS** (cada segundo o menos) y **DPMS** (cada milisegundo o menos). Todo lo
demás se registra con su cadencia escrita en palabras y no lleva sigla. La
clase no la asigna nadie: la fija el reloj, y se cae sola cuando el reloj deja
de cumplirse.

→ Página pública del protocolo: **[datosmexico.org/dpm](https://datosmexico.org/dpm)** · Sitio canónico: **[datosmexico.org](https://datosmexico.org)**

## Navegación

- **[Protocolo](PROTOCOLO.md)** — la especificación: nombre y siglas, los tres
  relojes, clases, degradación automática, dato servido y custodiado, métricas
  públicas y pulso, adhesión.
- **[Pulso](PULSO.md)** — la especificación técnica: catálogo, resumen por
  minuto, ingestas, usuarios, cálculo de clase y de métricas, lecturas públicas.
- **[Insignia](INSIGNIA.md)** — la insignia viva que sirve el pulso.
- **[Registro](REGISTRO.md)** — los sistemas adheridos, su estado y sus datos
  en clase.
- **[Fichas](fichas/)** — una ficha por sistema adherido.
- **[Plantillas](plantillas/)** — la ficha de adhesión para un sistema nuevo.
- **[¿Tiene México un dato por segundo?](docs/fuentes-por-minuto.md)** — investigación abierta: lo medido y lo pendiente.
- **[Changelog](CHANGELOG.md)** — todas las versiones del protocolo, con fecha
  y motivo.

## Estado

Versión 0.4.0, formalizada el 31 de octubre de 2026. Cuatro sistemas con
adhesión declarada y ninguno verificado. El pulso está en producción en la API del
Observatorio ([api.datosmexico.org/dpm/v1/estado](https://api.datosmexico.org/dpm/v1/estado),
documentación en [api.datosmexico.org/docs](https://api.datosmexico.org/docs), etiqueta `dpm`)
desde el 31 de octubre de 2026 y evalúa cada minuto. Ningún sistema reporta aún; hasta que
alguno lo haga, el protocolo no enuncia ninguna cifra en público, por regla propia.

## Relación con el Observatorio

Este protocolo es operativo. Se rige por el
[`MANIFESTO.md`](https://github.com/Datos-Mexico/observatorio/blob/main/MANIFESTO.md)
y el
[`MODELO.md`](https://github.com/Datos-Mexico/observatorio/blob/main/MODELO.md)
del repositorio institucional. Donde parezcan divergir, mandan ellos.

## Licencia y citación

Contenido bajo [CC BY 4.0](LICENSE). Formato de cita en
[`CITATION.cff`](CITATION.cff); indica siempre la versión del protocolo.
