// ==========================================================================
// Helpers para crear elementos del DOM
// ==========================================================================

/**
 * Crea un elemento HTML con clases, texto, atributos e hijos.
 * createElement('p', { className: 'card__name', text: 'Batman' })
 */
export const createElement = (tag, options = {}, children = []) => {
  const { className, text, attrs = {} } = options;
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  Object.entries(attrs).forEach(([name, value]) => element.setAttribute(name, value));
  children.forEach((child) => child && element.append(child));

  return element;
};

/** Vacía un elemento y le agrega nuevos hijos */
export const replaceContent = (container, ...children) => {
  container.replaceChildren(...children);
};
