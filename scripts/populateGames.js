const axios = require('axios');
const { Juego } = require('../models'); // Ajusta el path si tu modelo está en otro lugar

const RAWG_API_URL = 'https://api.rawg.io/api/games';
const RAWG_API_KEY = 'TU_API_KEY'; // Reemplaza por tu API Key de RAWG

async function fetchGames() {
  const res = await axios.get(RAWG_API_URL, {
    params: {
      key: RAWG_API_KEY,
      page_size: 15, // Cambia cuántos juegos quieres traer
    }
  });
  return res.data.results;
}

async function fetchGameDescription(gameId) {
  const res = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
    params: {
      key: RAWG_API_KEY
    }
  });
  return res.data.description_raw; // RAWG devuelve la descripción sin formato HTML
}

function getRandomPrice() {
  // Precio entre $20 y $80 dólares/euros/pesos
  return Math.floor(Math.random() * 61) + 20;
}

async function saveGamesToDB(games) {
  for (const game of games) {
    let descripcion = '';
    try {
      descripcion = await fetchGameDescription(game.id);
    } catch (e) {
      descripcion = 'Sin descripción.';
    }

    await Juego.create({
      nombre: game.name,
      imagen: game.background_image,
      precio: getRandomPrice(),
      categoria: game.genres.length ? game.genres[0].name : 'Sin categoría',
      fecha_lanzamiento: game.released,
      rating: game.rating,
      descripcion: descripcion
    });
    console.log(`Cargado: ${game.name}`);
  }
}

async function main() {
  try {
    const games = await fetchGames();
    await saveGamesToDB(games);
    console.log('Juegos cargados en la base de datos!');
  } catch (e) {
    console.error('Error al cargar juegos:', e);
  }
}

main();