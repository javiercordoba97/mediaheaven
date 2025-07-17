require('dotenv').config();
const axios = require('axios');
const { Juego, Genero } = require('../src/database/models');

const RAWG_API_URL = 'https://api.rawg.io/api/games';
const RAWG_API_KEY = process.env.RAWG_API_KEY;

const TOTAL_JUEGOS = 300; // Cambia este valor para traer la cantidad que quieras
const PAGE_SIZE = 20;

async function fetchGames() {
  let todos = [];
  let page = 1;
  while (todos.length < TOTAL_JUEGOS) {
    const res = await axios.get(RAWG_API_URL, {
      params: { key: RAWG_API_KEY, page_size: PAGE_SIZE, page },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    todos = todos.concat(res.data.results);
    if (res.data.results.length < PAGE_SIZE) break;
    page++;
  }
  return todos.slice(0, TOTAL_JUEGOS);
}

async function fetchGameDescription(gameId) {
  const res = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
    params: { key: RAWG_API_KEY },
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  return res.data.description_raw || 'Sin descripción.';
}

function getRandomPrice() {
  return Math.floor(Math.random() * 61) + 20;
}

async function saveGamesToDB(games) {
  const juegosGuardados = new Set();

  for (const game of games) {
    let descripcion = '';
    try {
      descripcion = await fetchGameDescription(game.id);
    } catch (e) {
      descripcion = 'Sin descripción.';
    }

    // Evitar duplicados solo por nombre (más seguro)
    const nombreKey = game.name.trim().toLowerCase();
    if (juegosGuardados.has(nombreKey)) {
      console.log(`Juego duplicado en fetch, no se carga: ${game.name}`);
      continue;
    }

    const existente = await Juego.findOne({
      where: { nombre: game.name }
    });
    if (existente) {
      console.log(`Juego duplicado en base de datos, no se carga: ${game.name}`);
      juegosGuardados.add(nombreKey);
      continue;
    }

    // Obtener género principal
    let idGenero = null;
    let generoNombre = game.genres.length ? game.genres[0].name : null;
    if (generoNombre) {
      let genero = await Genero.findOne({ where: { nombre: generoNombre } });
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
    juegosGuardados.add(nombreKey);
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