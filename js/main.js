// ==========================================================================
// Buscador de Superhéroes - punto de entrada
// ==========================================================================
import { searchHeroesByName } from './services/api.js';
import { readStateFromUrl, writeStateToUrl } from './utils/urlState.js';
import { renderHeroCards } from './components/heroCards.js';
import { showLoader, showMessage, clearStatus } from './components/status.js';

// --------------------------------------------------------------------------
// Elementos del DOM
// --------------------------------------------------------------------------
const elements = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  searchError: document.querySelector('#search-error'),
  results: document.querySelector('#results'),
  resultsCount: document.querySelector('#results-count'),
  status: document.querySelector('#status'),
  grid: document.querySelector('#results-grid'),
};

// Guardamos la última búsqueda para no volver a pedirla a la API
// al ordenar, cambiar de página o volver desde el detalle.
const searchCache = { term: '', results: [] };

// Identifica la última petición para descartar respuestas viejas
let currentRequestId = 0;

// --------------------------------------------------------------------------
// Datos
// --------------------------------------------------------------------------
const getSearchResults = async (term) => {
  const normalizedTerm = term.toLowerCase();
  if (searchCache.term === normalizedTerm) return searchCache.results;

  const results = await searchHeroesByName(term);
  searchCache.term = normalizedTerm;
  searchCache.results = results;
  return results;
};

// --------------------------------------------------------------------------
// Navegación
// --------------------------------------------------------------------------
const navigate = (newState, options) => {
  writeStateToUrl(newState, options);
  render();
};

// --------------------------------------------------------------------------
// Vistas
// --------------------------------------------------------------------------
const syncFormWithState = ({ search }) => {
  elements.searchInput.value = search;
};

const resetResults = () => {
  elements.resultsCount.textContent = 0;
  elements.grid.replaceChildren();
};

const renderResultsView = async (state, requestId) => {
  if (!state.search) {
    resetResults();
    showMessage(elements.status, 'Escribí el nombre de un personaje para comenzar la búsqueda.');
    return;
  }

  resetResults();
  showLoader(elements.status, 'Buscando personajes...');

  try {
    const results = await getSearchResults(state.search);
    if (requestId !== currentRequestId) return;

    elements.resultsCount.textContent = results.length;

    if (!results.length) {
      showMessage(elements.status, `No se encontraron personajes para "${state.search}".`);
      return;
    }

    clearStatus(elements.status);
    renderHeroCards(elements.grid, results);
  } catch (error) {
    if (requestId !== currentRequestId) return;
    showMessage(elements.status, `No se pudieron cargar los resultados. ${error.message}`, 'error');
  }
};

const render = () => {
  const state = readStateFromUrl();
  currentRequestId += 1;

  syncFormWithState(state);

  return renderResultsView(state, currentRequestId);
};

// --------------------------------------------------------------------------
// Eventos
// --------------------------------------------------------------------------
const handleSearchSubmit = (event) => {
  event.preventDefault();
  const search = elements.searchInput.value.trim();

  if (!search) {
    elements.searchError.textContent = 'Ingresá un nombre para buscar.';
    elements.searchError.hidden = false;
    elements.searchInput.focus();
    return;
  }

  elements.searchError.hidden = true;
  navigate({ search });
};

const clearSearchError = () => {
  elements.searchError.hidden = true;
};

// --------------------------------------------------------------------------
// Inicio
// --------------------------------------------------------------------------
const init = () => {
  elements.form.addEventListener('submit', handleSearchSubmit);
  elements.searchInput.addEventListener('input', clearSearchError);

  // Botones atrás/adelante del navegador
  window.addEventListener('popstate', render);

  render();
};

init();
