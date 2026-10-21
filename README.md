# 🦸 Buscador de Superhéroes

Trabajo Práctico Integrador · Front End

Aplicación web que permite buscar superhéroes por nombre, ordenarlos alfabéticamente, recorrer los resultados con un paginado y ver la ficha completa de cada personaje. Los datos se obtienen de la [SuperHero API](https://superheroapi.com).

🔗 **Deploy:** https://mariquelme42.github.io/buscador-superheroes/

---

## ✅ Funcionalidades

**Principales**
- Búsqueda de personajes por nombre (con validación de campo vacío).
- Ordenamiento alfabético A-Z / Z-A (hecho en el frontend).
- Total de resultados de cada búsqueda.
- Paginado de 20 resultados por página: primera, anterior, siguiente y última, con los botones deshabilitados cuando no se pueden usar.
- Detalle del personaje: imagen, nombre, nombre real, editorial, biografía (alias, lugar de nacimiento, ocupación, etc.), estadísticas de poder, altura y peso, conexiones y afiliaciones.
- Mensajes de carga, de "sin resultados" y de error.

**Desafíos extra**
- Página actual y cantidad total de páginas en el paginado.
- Ir a una página específica mediante un `select`.
- Botón "Volver a la búsqueda" que regresa a la búsqueda, el orden y la página exactos. El estado se guarda en la URL (`?search=man&order=desc&page=2&id=70`), así que también funcionan los botones atrás/adelante del navegador y se puede compartir el link.
- Modo oscuro, con la preferencia guardada en `localStorage`.

## 🛠 Tecnologías y conceptos aplicados

| Tema de cursada | Dónde se aplica |
| --- | --- |
| DOM: creación de nodos, `append`, `replaceChildren` | `js/utils/dom.js`, `js/components/*` |
| Eventos, `preventDefault`, delegación de eventos | `js/main.js` (submit, change, click en grilla y paginado) |
| Formularios y validación | Formulario de búsqueda |
| Componentes (toggle) | `js/components/themeToggle.js` |
| `localStorage` y objeto `location` / `URLSearchParams` | `themeToggle.js`, `js/utils/urlState.js` |
| Desestructuración y spread | Detalle del personaje, `sortByName`, estado de la URL |
| Asincronía: `fetch`, `async/await`, `try/catch` | `js/services/api.js`, `js/main.js` |
| API REST: colección vs. recurso, objeto `URL` | `/search/{nombre}` (colección) y `/{id}` (recurso) |
| Ordenamiento y paginado en el frontend | `sortByName` y `paginate` en `js/utils/helpers.js` |
| Grillas y responsive | CSS Grid + media queries mobile-first |
| Preprocesador SASS | Variables, mapas, `@each`, mixins, funciones, anidado, BEM y parciales |

## 📁 Estructura

```
├── index.html
├── assets/img/placeholder.svg      # imagen por defecto si falla la del personaje
├── css/main.css                     # CSS compilado (no editar a mano)
├── scss/
│   ├── main.scss                    # punto de entrada
│   ├── abstracts/                   # variables, funciones y mixins
│   ├── base/                        # reset, temas (claro/oscuro) y estilos base
│   ├── layout/                      # container, header y footer
│   ├── components/                  # botón, formulario, card, paginado, stat-bar...
│   └── pages/                       # vista de detalle
└── js/
    ├── main.js                      # inicio, eventos y renderizado de vistas
    ├── config.js                    # token, URL base y constantes
    ├── services/api.js              # llamadas a la API
    ├── utils/                       # helpers puros, helpers del DOM y estado en URL
    └── components/                  # cards, paginado, detalle, estados, modo oscuro
```

## 🚀 Cómo correrlo

1. Clonar el repositorio.
2. Pedir el access-token en https://superheroapi.com y pegarlo en `js/config.js`:
   ```js
   export const API_TOKEN = 'TU_ACCESS_TOKEN';
   ```
3. Abrir `index.html` con **Live Server** de VS Code (el JS usa módulos ES, por eso necesita un servidor y no funciona abriendo el archivo con doble clic).

### Compilar SASS

```bash
npm install
npm run sass          # compila una vez
npm run sass:watch    # recompila al guardar
```

También se puede usar la extensión **Live Sass Compiler** apuntando la salida a `css/`.

## 🌿 Flujo de trabajo con Git

Nunca se trabaja directamente en `main`. Cada funcionalidad se desarrolla en su rama y se integra con un Pull Request.

| Rama | Pull Request |
| --- | --- |
| `feature/estructura-y-estilos-base` | Estructura HTML semántica y arquitectura SASS |
| `feature/busqueda-por-nombre` | Búsqueda de superhéroes por nombre |
| `feature/ordenamiento-alfabetico` | Ordenamiento alfabético ascendente y descendente |
| `feature/paginado` | Paginado de 20 resultados con navegación |
| `feature/detalle-personaje` | Vista de detalle y volver a la búsqueda |
| `feature/modo-oscuro` | Modo oscuro con preferencia persistente |
| `docs/readme-y-deploy` | Documentación y deploy |

## 🌐 Deploy en GitHub Pages

1. En el repositorio ir a **Settings → Pages**.
2. En *Source* elegir **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. Guardar. A los pocos minutos el sitio queda publicado en `https://<usuario>.github.io/<repositorio>/`.

> ⚠️ El token de la API queda visible en el código del frontend. Para esta API gratuita es aceptable, pero en un proyecto real se resolvería desde un backend.
