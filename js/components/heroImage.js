import { PLACEHOLDER_IMAGE } from '../config.js';
import { createElement } from '../utils/dom.js';

/**
 * Crea la imagen de un personaje. Si la imagen no carga, muestra un placeholder.
 * referrerpolicy="no-referrer" evita el bloqueo por hotlinking del sitio de imágenes.
 */
export const createHeroImage = ({ name, image }, className) => {
  const img = createElement('img', {
    className,
    attrs: {
      src: image?.url || PLACEHOLDER_IMAGE,
      alt: `Imagen de ${name}`,
      loading: 'lazy',
      referrerpolicy: 'no-referrer',
    },
  });

  img.addEventListener('error', () => {
    img.src = PLACEHOLDER_IMAGE;
  }, { once: true });

  return img;
};
