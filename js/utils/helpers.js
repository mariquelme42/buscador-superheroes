// ==========================================================================
// Funciones puras reutilizables (no tocan el DOM)
// ==========================================================================
import { ORDER } from '../config.js';

const EMPTY_VALUES = ['', '-', 'null', 'undefined', '- lb', '0 kg', '0 cm'];

/** Indica si un valor devuelto por la API no tiene información útil */
export const isEmptyValue = (value) =>
  value === null || value === undefined || EMPTY_VALUES.includes(String(value).trim());

/** Devuelve el valor o un texto por defecto si está vacío */
export const formatValue = (value, fallback = 'Sin datos') =>
  isEmptyValue(value) ? fallback : String(value);

/** Une un array de strings descartando valores vacíos */
export const formatList = (list = [], fallback = 'Sin datos') => {
  const values = list.filter((item) => !isEmptyValue(item));
  return values.length ? values.join(', ') : fallback;
};

/** Convierte un valor de estadística ("85" | "null") en número entre 0 y 100 */
export const toStatNumber = (value) => {
  const number = Number.parseInt(value, 10);
  return Number.isNaN(number) ? null : Math.min(Math.max(number, 0), 100);
};

/** Ordena alfabéticamente por nombre sin modificar el array original */
export const sortByName = (list, order = ORDER.ASC) => {
  const sorted = [...list].sort((a, b) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
  );
  return order === ORDER.DESC ? sorted.reverse() : sorted;
};
