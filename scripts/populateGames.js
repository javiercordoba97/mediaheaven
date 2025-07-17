require('dotenv').config();
const axios = require('axios');
const { Juego, Genero } = require('../src/database/models'); // Importa ambos modelos

const RAWG_API_URL = 'https://api.rawg.io/api/games';
const RAWG_API_KEY = process.env.RAWG_API_KEY; // Lee la API Key desde .env

async function fetchGames() {
  const res = await axios.get(RAWG_API_URL, {
    params: {
      key: RAWG_API_KEY,
      page_size: 15,
    },
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });
  return res.data.results;
}

async function fetchGameDescription(gameId) {
  const res = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
    params: {
      key: RAWG_API_KEY
    },
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });
  return res.data.description_raw || 'Sin descripción.';
}

function getRandomPrice() {
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

    // Obtener el género principal
    let idGenero = null;
    let generoNombre = game.genres.length ? game.genres[0].name : null;
    if (generoNombre) {
      // Busca si el género existe en la tabla generos
      let genero = await Genero.findOne({ where: { nombre: generoNombre } });
      // Si no existe, lo crea
      if (!genero) {
        genero = await Genero.create({ nombre: generoNombre });
      }
      idGenero = genero.id;
    }

    await Juego.create({
      nombre: game.name,
      imagen: game.background_image,
      precio: getRandomPrice(),
      descripcion: descripcion,
      fecha: game.released,
      rating: game.rating,
      id_genero: idGenero,
      stock: true
    });
    console.log(`Cargado: ${game.name} - Género: ${generoNombre} (id: ${idGenero})`);
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