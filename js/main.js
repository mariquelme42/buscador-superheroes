// ==========================================================================
// Buscador de Superhéroes - punto de entrada
// ==========================================================================
import { RESULTS_PER_PAGE } from './config.js';
import { searchHeroesByName } from './services/api.js';
import { sortByName, paginate, getTotalPages, clamp } from './utils/helpers.js';
import { readStateFromUrl, writeStateToUrl } from './utils/urlState.js';
import { renderHeroCards } from './components/heroCards.js';
import { renderPagination, getTargetPage } from './components/pagination.js';
import { showLoader, showMessage, clearStatus } from './components/status.js';

// --------------------------------------------------------------------------
// Elementos del DOM
// --------------------------------------------------------------------------
const elements = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  orderSelect: document.querySelector('#order-select'),
  searchError: document.querySelector('#search-error'),
  results: document.querySelector('#results'),
  resultsCount: document.querySelector('#results-count'),
  status: document.querySelector('#status'),
  grid: document.querySelector('#results-grid'),
  pagination: {
    nav: document.querySelector('#pagination'),
    pageSelect: document.querySelector('#page-select'),
    totalPagesLabel: document.querySelector('#total-pages'),
  },
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
const syncFormWithState = ({ search, order }) => {
  elements.searchInput.value = search;
  elements.orderSelect.value = order;
};

const resetResults = () => {
  elements.resultsCount.textContent = 0;
  elements.grid.replaceChildren();
  elements.pagination.nav.hidden = true;
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

    const sortedResults = sortByName(results, state.order);
    const totalPages = getTotalPages(sortedResults.length, RESULTS_PER_PAGE);
    const currentPage = clamp(state.page, 1, totalPages);

    // Si la página de la URL no existe, la corregimos
    if (currentPage !== state.page) {
      writeStateToUrl({ ...state, page: currentPage }, { replace: true });
    }

    elements.resultsCount.textContent = sortedResults.length;

    if (!sortedResults.length) {
      showMessage(elements.status, `No se encontraron personajes para "${state.search}".`);
      return;
    }

    clearStatus(elements.status);
    renderHeroCards(elements.grid, paginate(sortedResults, currentPage, RESULTS_PER_PAGE));
    renderPagination(elements.pagination, { currentPage, totalPages });
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
  navigate({ search, order: elements.orderSelect.value, page: 1 });
};

const handleOrderChange = () => {
  const state = readStateFromUrl();
  if (!state.search) return;
  navigate({ ...state, order: elements.orderSelect.value, page: 1 });
};

const goToPage = (page) => {
  const state = readStateFromUrl();
  navigate({ ...state, page });
  elements.results.scrollIntoView({ behavior: 'smooth' });
};

const handlePaginationClick = (event) => {
  const button = event.target.closest('button[data-page]');
  if (!button || button.disabled) return;

  const { page } = readStateFromUrl();
  const totalPages = elements.pagination.pageSelect.options.length;
  goToPage(getTargetPage(button.dataset.page, page, totalPages));
};

const handlePageSelectChange = (event) => {
  goToPage(Number(event.target.value));
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
  elements.orderSelect.addEventListener('change', handleOrderChange);
  elements.pagination.nav.addEventListener('click', handlePaginationClick);
  elements.pagination.pageSelect.addEventListener('change', handlePageSelectChange);

  // Botones atrás/adelante del navegador
  window.addEventListener('popstate', render);

  render();
};

init();
