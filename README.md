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
p01: { marcador: [2, 0], pasa: null, estado: "final" }
```

Si quieres mostrar un resultado en vivo/parcial:

```js
p01: { marcador: [1, 0], pasa: "L", estado: "parcial" }
```

Cuando termine el partido, cambia el estado a:

```js
p01: { marcador: [1, 0], pasa: "L", estado: "final" }
```

Si el marcador queda empatado, debes indicar quién pasa:

```js
p01: { marcador: [1, 1], pasa: "L", estado: "final" } // pasa local
p01: { marcador: [1, 1], pasa: "V", estado: "final" } // pasa visitante
```

`L` = local.  
`V` = visitante.

## Reglas

Cada partido de eliminatoria vale máximo 3 puntos.

### Si el marcador real NO es empate

- +1 punto si aciertas el ganador/clasificado.
- +2 puntos adicionales si aciertas el marcador exacto.

### Si el marcador real SÍ es empate

- +1 punto si pronosticas empate.
- +1 punto si aciertas quién pasa.
- +1 punto si aciertas el marcador exacto.

Ejemplo: si Brasil vs Japón termina 1-1 y clasifica Japón, quien pronosticó 1-1 pero clasificó Brasil recibe 2 puntos.

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

## Marcador parcial / final

En cada resultado puedes usar `estado`:

- `estado: "parcial"` muestra **MARCADOR PARCIAL** y los puntos se muestran como parciales.
- `estado: "final"` muestra **RESULTADO FINAL**.

Si omites `estado`, la página lo interpreta como `final` cuando hay marcador.


## Regla vigente de puntos

En eliminatorias la puntuación se calcula así:

- Si no hay empate real: +1 por ganador/clasificado correcto y +2 por marcador exacto.
- Si hay empate real: +1 por empate pronosticado, +1 por clasificado correcto y +1 por marcador exacto.
- Máximo 3 puntos por partido.

## Marcador parcial / en vivo

Para marcar un partido como parcial usa:

```js
p09: { marcador: [1, 1], pasa: null, estado: "parcial" }
```

Cuando termine, cambia a:

```js
p09: { marcador: [1, 1], pasa: "L", estado: "final" }
```

`L` = clasifica local. `V` = clasifica visitante.
