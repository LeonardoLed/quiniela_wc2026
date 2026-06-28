# Quiniela Mundial 2026

Proyecto estático listo para GitHub Pages.

## Dónde editar

Todo lo manual se modifica en:

```text
data/config.js
```

## Participantes y puntos de grupos

Busca `participantes` y cambia `nombre` o `grupos`.

## Resultados y pronósticos

Cada partido usa este formato:

```js
p01: { marcador: [2, 0], pasa: null }
```

Si el marcador queda empatado, debes indicar quién pasa:

```js
p01: { marcador: [1, 1], pasa: "L" } // pasa local
p01: { marcador: [1, 1], pasa: "V" } // pasa visitante
```

`L` = local.  
`V` = visitante.

## Reglas

- Marcador exacto sin empate: 3 pts.
- Marcador exacto con empate y clasificado correcto: 3 pts.
- Clasificado/ganador correcto: 1 pt.
- Empate exacto pero clasificado incorrecto: 0 pts.

## GitHub Pages

Sube `index.html`, `css/`, `js/`, `data/` y este README a la raíz del repositorio.
