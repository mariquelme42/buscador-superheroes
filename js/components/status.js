import { createElement, replaceContent } from '../utils/dom.js';

/** Muestra el spinner de carga */
export const showLoader = (container, text = 'Cargando...') => {
  const loader = createElement('div', { className: 'loader' }, [
    createElement('span', { className: 'loader__spinner', attrs: { 'aria-hidden': 'true' } }),
    createElement('p', { text }),
  ]);
  replaceContent(container, loader);
};

/** Muestra un mensaje informativo o de error */
export const showMessage = (container, text, type = 'info') => {
  const modifier = type === 'error' ? ' status__message--error' : '';
  replaceContent(container, createElement('p', { className: `status__message${modifier}`, text }));
};

export const clearStatus = (container) => replaceContent(container);
