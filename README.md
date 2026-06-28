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


## Ajustes recientes
- El desglose por jugador ahora tiene fases contraíbles.
- La sección **Finales** incluye la gran final y el partido por tercer lugar.
- Los puntos de fase de grupos se muestran centrados.


## Última actualización automática

La leyenda de **Última actualización** se obtiene automáticamente del último commit del repositorio en GitHub Pages. No necesitas editar fecha ni hora manualmente.

Si pruebas el proyecto en tu computadora local, puede aparecer como `No disponible`; en GitHub Pages se mostrará con el formato:

```text
DD/MM/AAAA · HH:mm h
```

## Fase abierta por defecto

En `data/config.js` puedes decidir qué fase aparece abierta en el desglose de cada jugador:

```js
faseAbierta: "d16"
```

Opciones: `"grupos"`, `"d16"`, `"d8"`, `"d4"`, `"semi"`, `"final"`.

Por defecto queda abierto `d16` y las demás fases quedan contraídas.
