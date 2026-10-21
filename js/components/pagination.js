import { createElement, replaceContent } from '../utils/dom.js';

/**
 * Actualiza el paginado: estado de los botones, página actual y total de páginas.
 */
export const renderPagination = (elements, { currentPage, totalPages }) => {
  const { nav, pageSelect, totalPagesLabel } = elements;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  nav.hidden = totalPages <= 1;

  nav.querySelector('[data-page="first"]').disabled = isFirstPage;
  nav.querySelector('[data-page="prev"]').disabled = isFirstPage;
  nav.querySelector('[data-page="next"]').disabled = isLastPage;
  nav.querySelector('[data-page="last"]').disabled = isLastPage;

  const options = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return createElement('option', { text: page, attrs: { value: page } });
  });
  replaceContent(pageSelect, ...options);
  pageSelect.value = currentPage;

  totalPagesLabel.textContent = totalPages;
};

/**
 * Calcula a qué página hay que ir según el botón presionado.
 */
export const getTargetPage = (action, currentPage, totalPages) => {
  const targets = {
    first: 1,
    prev: currentPage - 1,
    next: currentPage + 1,
    last: totalPages,
  };
  return targets[action] ?? currentPage;
};
