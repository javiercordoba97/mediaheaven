const express = require("express");
const path = require("path");
const mainRouter = require('./src/routers/mainRouter');
const productRouter = require('./src/routers/productRouter');
const userRouter = require('./src/routers/userRouter');
const app = express();
const methodOverride = require('method-override');
const apiUser = require("./src/routers/apis/userRouteApis");
const apiProduct = require("./src/routers/apis/productRouteApis");
const cookie = require('cookie-parser');
const session = require('express-session');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const cors = require('cors');
const { METHODS } = require("http");
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

app.options("*", cors(corsConfig));
app.use(cors(corsConfig))
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie());
// ¡ATENCIÓN! Para producción, usa un store de sesión persistente (ej, Redis)
// Vercel NO soporta sesiones en memoria entre requests
app.use(session({
  secret: "secreto",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set('views', path.join(__dirname, 'src/views'));
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