import { createElement, replaceContent } from '../utils/dom.js';
import { formatValue, formatList, toStatNumber } from '../utils/helpers.js';
import { createHeroImage } from './heroImage.js';

const STAT_LABELS = {
  intelligence: 'Inteligencia',
  strength: 'Fuerza',
  speed: 'Velocidad',
  durability: 'Resistencia',
  power: 'Poder',
  combat: 'Combate',
};

const ALIGNMENT_LABELS = {
  good: 'Héroe',
  bad: 'Villano',
  neutral: 'Neutral',
};

/** Crea una lista de pares término/valor: [['Alias', 'Bruce'], ...] */
const createDataList = (items) => {
  const children = items.flatMap(([term, value]) => [
    createElement('dt', { className: 'data-list__term', text: term }),
    createElement('dd', { className: 'data-list__value', text: value }),
  ]);
  return createElement('dl', { className: 'data-list' }, children);
};

/** Crea una sección con subtítulo */
const createSection = (title, content) =>
  createElement('section', { className: 'detail__section' }, [
    createElement('h3', { className: 'detail__subtitle', text: title }),
    content,
  ]);

/** Barra de una estadística de poder */
const createStatBar = ([key, rawValue]) => {
  const value = toStatNumber(rawValue);
  const label = STAT_LABELS[key] ?? key;

  const fill = createElement('div', { className: 'stat-bar__fill' });
  fill.style.setProperty('--stat-value', `${value ?? 0}%`);

  return createElement('div', { className: `stat-bar stat-bar--${key}` }, [
    createElement('div', { className: 'stat-bar__header' }, [
      createElement('span', { text: label }),
      createElement('span', { text: value === null ? 'Sin datos' : `${value}/100` }),
    ]),
    createElement('div', {
      className: 'stat-bar__track',
      attrs: { role: 'meter', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': value ?? 0 },
    }, [fill]),
  ]);
};

/** Une las medidas en ambos sistemas: ["6'2", "188 cm"] => "6'2 / 188 cm" */
const formatMeasure = (values = []) => formatList(values).replace(', ', ' / ');

/**
 * Pinta el detalle completo de un personaje.
 */
export const renderHeroDetail = (container, hero, { onBack, backLabel }) => {
  const {
    name,
    powerstats = {},
    biography = {},
    appearance = {},
    work = {},
    connections = {},
  } = hero;

  const backButton = createElement('button', {
    className: 'button detail__back',
    text: backLabel,
    attrs: { type: 'button' },
  });
  backButton.addEventListener('click', onBack);

  const header = createElement('header', {}, [
    createElement('h2', { className: 'detail__name', text: name, attrs: { id: 'detail-title', tabindex: '-1' } }),
    createElement('p', { className: 'detail__real-name', text: `Nombre real: ${formatValue(biography['full-name'])}` }),
    createElement('span', { className: 'detail__badge', text: formatValue(biography.publisher, 'Editorial desconocida') }),
  ]);

  const bioSection = createSection('Biografía', createDataList([
    ['Alias', formatList(biography.aliases)],
    ['Alter egos', formatValue(biography['alter-egos'], 'Sin alter egos')],
    ['Lugar de nacimiento', formatValue(biography['place-of-birth'])],
    ['Primera aparición', formatValue(biography['first-appearance'])],
    ['Bando', ALIGNMENT_LABELS[biography.alignment] ?? formatValue(biography.alignment)],
    ['Ocupación', formatValue(work.occupation)],
    ['Base de operaciones', formatValue(work.base)],
  ]));

  const statsSection = createSection('Estadísticas de poder',
    createElement('div', { className: 'stats' }, Object.entries(powerstats).map(createStatBar))
  );

  const appearanceSection = createSection('Apariencia', createDataList([
    ['Altura', formatMeasure(appearance.height)],
    ['Peso', formatMeasure(appearance.weight)],
    ['Género', formatValue(appearance.gender)],
    ['Raza', formatValue(appearance.race)],
  ]));

  const connectionsSection = createSection('Conexiones', createDataList([
    ['Afiliaciones', formatValue(connections['group-affiliation'])],
    ['Familiares', formatValue(connections.relatives)],
  ]));

  const layout = createElement('div', { className: 'detail__layout' }, [
    createElement('figure', { className: 'detail__figure' }, [createHeroImage(hero, 'detail__image')]),
    createElement('div', { className: 'detail__info' }, [
      header, bioSection, statsSection, appearanceSection, connectionsSection,
    ]),
  ]);

  replaceContent(container, backButton, layout);
};
