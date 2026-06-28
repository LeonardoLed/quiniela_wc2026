# Quiniela Mundial 2026

Proyecto estático para GitHub Pages. No usa base de datos ni backend.

## Qué editar

Edita únicamente:

```text
data/config.js
```

Ahí puedes modificar participantes, puntos de grupos, partidos, fechas, resultados reales y pronósticos.

## Formato normal

Para partidos sin empate:

```js
p01: [2, 1]
```

## Formato para empates en eliminatoria

Si el marcador queda empatado, indica quién pasa:

```js
p01: { marcador: [1, 1], pasa: "L" }
```

- `L` = pasa el equipo local.
- `V` = pasa el equipo visitante.

El mismo formato se usa en resultados reales y pronósticos.

## Reglas de puntos

- Marcador exacto = 3 puntos.
- Si hay empate, el marcador exacto solo da 3 puntos si también coincide quién pasa.
- Acertar quién pasa / ganador = 1 punto.
- Error = 0 puntos.

## Publicar en GitHub Pages

Sube estos archivos a la raíz del repositorio:

```text
index.html
css/style.css
js/app.js
data/config.js
README.md
```

Luego activa GitHub Pages desde `Settings > Pages > Deploy from a branch > main > /(root)`.
