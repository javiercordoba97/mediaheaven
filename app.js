const express = require("express");
const path = require("path");
const mainRouter = require('./src/routers/mainRouter'); // Actualizar la ruta si se mueve app.js
const productRouter = require('./src/routers/productRouter'); // Actualizar la ruta si se mueve app.js
const userRouter = require('./src/routers/userRouter'); // Actualizar la ruta si se mueve app.js
const app = express();
const methodOverride = require('method-override');
const apiUser = require("./src/routers/apis/userRouteApis"); // Actualizar la ruta si se mueve app.js
const apiProduct = require("./src/routers/apis/productRouteApis"); // Actualizar la ruta si se mueve app.js
const cookie = require('cookie-parser');
const session = require('express-session');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde un archivo .env
dotenv.config();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

// Probar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie());
app.use(session({ secret: "secreto", resave: false, saveUninitialize: false }));

app.set('views', path.join(__dirname, 'src/views')); // Actualizar la ruta si se mueve app.js
app.set('view engine', 'ejs');

app.listen(3000, () => console.log("Server on"));

app.use(mainRouter);
app.use(productRouter);
app.use(userRouter);

app.use("/api/user", apiUser);
app.use("/api/product", apiProduct);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;