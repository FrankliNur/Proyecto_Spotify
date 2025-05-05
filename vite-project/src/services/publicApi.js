// src/services/publicApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getGenres = async () => {
  const { data } = await axios.get(`${API_URL}/generos`);
  return data;
};

export const getArtistsByGenre = async (genreId) => {
  const { data } = await axios.get(`${API_URL}/artistas/by-genero/${genreId}`);
  return data;
};

export const getGenreById = async (genreId) => {
  const { data } = await axios.get(`${API_URL}/generos/${genreId}`);
  return data;
};

export const getArtistById = async (artistId) => {
  const { data } = await axios.get(`${API_URL}/artistas/${artistId}`);
  return data;
};

export const getAlbumsByArtist = async (artistId) => {
  const { data } = await axios.get(`${API_URL}/albums/by-artista/${artistId}?_embed=canciones`);
  return data;
};