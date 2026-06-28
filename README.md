# Quiniela Mundial 2026

Proyecto estático para GitHub Pages.

## Qué editar

Edita solo `data/config.js` para cambiar participantes, resultados, pronósticos, fechas y reglas.

## Empates en eliminatoria

Puedes seguir usando el formato simple cuando no hay empate:

```js
p01: [2, 1]
```

Si el partido queda empatado y quieres indicar quién pasa:

```js
p01: { marcador: [1, 1], pasa: 'L' } // pasa el local
p02: { marcador: [2, 2], pasa: 'V' } // pasa el visitante
```

La misma regla aplica en `resultados` y en `pronosticos`.

## Reglas de puntos

- Marcador exacto + clasificado correcto si hubo empate: 3 pts
- Solo ganador/clasificado correcto: 1 pt
- Error: 0 pts

## Publicación

Sube `index.html`, `css/`, `js/`, `data/` y `README.md` a la raíz de tu repositorio y activa GitHub Pages desde `Settings > Pages`.
