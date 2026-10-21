// ==========================================================================
// Estado de la app guardado en la URL (?search=batman&order=asc&page=2&id=70)
// Permite volver a la búsqueda exacta, recargar la página o compartir el link.
// ==========================================================================
import { ORDER } from '../config.js';

/** Lee el estado actual desde los parámetros de la URL */
export const readStateFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get('page'), 10);

  return {
    search: params.get('search')?.trim() ?? '',
    order: params.get('order') === ORDER.DESC ? ORDER.DESC : ORDER.ASC,
    page: Number.isNaN(page) || page < 1 ? 1 : page,
    id: params.get('id'),
  };
};

/** Escribe el estado en la URL sin recargar la página */
export const writeStateToUrl = (state, { replace = false } = {}) => {
  const url = new URL(window.location.href);
  url.search = '';

  Object.entries(state).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const method = replace ? 'replaceState' : 'pushState';
  window.history[method](null, '', url);
};
