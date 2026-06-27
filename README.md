# Quiniela Mundial 2026

Sitio estático para publicar una quiniela en **GitHub Pages**. No usa base de datos ni backend.

## Archivos importantes

- `index.html`: estructura de la página.
- `css/style.css`: estilos visuales.
- `js/app.js`: lógica automática de puntos, ranking, paneles y gráfica.
- `data/config.js`: único archivo que normalmente debes editar.

## Cómo actualizar resultados

Abre `data/config.js` y modifica:

```js
resultados: {
  d16: {
    p01: [2, 0],
    p02: null
  }
}
```

- Resultado jugado: `[golesLocal, golesVisitante]`
- Sin resultado: `null`

Los puntos se calculan automáticamente con:

- Marcador exacto: 3 puntos
- Ganador/empate correcto: 1 punto
- Error: 0 puntos

## Fechas manuales de partidos

En `partidos`, puedes llenar la fecha con formato `DD/MM hh:mm`:

```js
p01: {
  local: "Argentina",
  flagL: "ar",
  visita: "Australia",
  flagV: "au",
  fecha: "14/06 20:00"
}
```

Si `fecha` está vacía, no se muestra.

## Ranking animado

En `data/config.js` puedes llenar `rankingAnterior` con el orden de la actualización previa:

```js
rankingAnterior: ["Carlos", "Sofía", "Lucía"]
```

La tabla mostrará flechas de subida/bajada. Si lo dejas vacío, el navegador intentará comparar con el último ranking guardado en `localStorage`.

## Banderas

Se usan banderas de `flagcdn.com` mediante código ISO de dos letras. Ejemplo: México = `mx`, Argentina = `ar`.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube todos los archivos de esta carpeta.
3. En GitHub ve a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/root`.
6. Guarda los cambios.

GitHub te dará una URL pública para compartir la quiniela.
