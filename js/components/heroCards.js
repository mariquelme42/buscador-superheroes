import { createElement, replaceContent } from '../utils/dom.js';
import { formatValue } from '../utils/helpers.js';
import { createHeroImage } from './heroImage.js';

/** Crea la tarjeta de un personaje */
const createHeroCard = (hero) => {
  const { id, name, biography } = hero;

  const button = createElement('button', {
    className: 'card__button',
    attrs: { type: 'button', 'data-id': id, 'aria-label': `Ver detalle de ${name}` },
  }, [
    createElement('figure', { className: 'card__figure' }, [createHeroImage(hero, 'card__image')]),
    createElement('div', { className: 'card__body' }, [
      createElement('h3', { className: 'card__name', text: name }),
      createElement('p', { className: 'card__publisher', text: formatValue(biography?.publisher, 'Editorial desconocida') }),
    ]),
  ]);

  return createElement('li', { className: 'card' }, [button]);
};

/** Pinta la grilla de resultados */
export const renderHeroCards = (container, heroes) => {
  replaceContent(container, ...heroes.map(createHeroCard));
};
