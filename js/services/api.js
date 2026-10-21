// ==========================================================================
// Servicio de acceso a la SuperHero API
// ==========================================================================
import { API_BASE_URL, API_TOKEN } from '../config.js';

const NOT_FOUND_MESSAGE = 'character with given name not found';

/**
 * Hace un GET a la API y devuelve el JSON.
 * Lanza un error si la respuesta HTTP no es correcta o si la API informa un error.
 */
const fetchFromApi = async (path) => {
  if (!API_TOKEN || API_TOKEN === 'TU_ACCESS_TOKEN') {
    throw new Error('Falta configurar el access-token de la API en js/config.js');
  }

  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error de conexión con la API (HTTP ${response.status})`);
  }

  return response.json();
};

/**
 * Busca personajes por nombre.
 * Devuelve siempre un array (vacío si no hay coincidencias).
 */
export const searchHeroesByName = async (name) => {
  const data = await fetchFromApi(`/search/${encodeURIComponent(name)}`);

  if (data.response === 'error') {
    if (data.error === NOT_FOUND_MESSAGE) return [];
    throw new Error(data.error);
  }

  return data.results ?? [];
};

/**
 * Obtiene un personaje por su id (recurso individual).
 */
export const getHeroById = async (id) => {
  const data = await fetchFromApi(`/${encodeURIComponent(id)}`);

  if (data.response === 'error') {
    throw new Error('No se encontró el personaje solicitado');
  }

  return data;
};
