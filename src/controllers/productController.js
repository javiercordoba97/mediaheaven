let fs = require('fs')
let path = require('path')
const db = require("../database/models")
const { Op } = require('sequelize') // <--- Importa Op para búsquedas flexibles
const { body } = require('express-validator')
const juegos = db.Juego

let listaProductos = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/productos.json'),'utf-8'))

const productController = {
    detalle: async (req, res) => {
        let productoEncontrado = await juegos.findByPk(req.params.id, {paranoid: false})
        res.render ('products/product', {productoEncontrado})
    },
    cart: async (req, res) => {
        res.render('products/cart')
    },
    creacion: (req, res) =>{
        res.render('products/creacion')
    },
    crearProcess: async function (req,res){
        let productoNuevo = await db.Juego.create({
            "nombre": req.body.titulo,
            "precio": req.body.precio,
            "imagen": req.file ? req.file.filename : "default.png",
            "fecha": req.body.estreno,
            "id_genero": req.body.categoria,
            "descripcion": req.body.descripcion,
            "rating": req.body.rating,
            "stock": true
        })
        res.redirect('/product/' + productoNuevo.id)
    },
    edicion: async function (req, res) {
        let productoEncontrado = await juegos.findByPk(req.params.id)
        res.render ('./products/edicion', {productoEncontrado: productoEncontrado})
    },
    editarProcess: async function (req,res) {
        let productoEncontrado = await juegos.update({
            "nombre": req.body.nombre,
            "precio": req.body.precio,
            "imagen": req.file ? req.file.filename : "default.png",
            "estreno": req.body.fecha,
            "id_genero": req.body.categoria,
            "descripcion": req.body.descripcion,
            "rating": req.body.rating,
            "stock": true,
            "borrado": false
        }, {where: {id: req.params.id}})
        res.redirect('/product/' + req.params.id)
    },
    deleteProcess: async function (req, res) {
        const productoEliminado = await juegos.destroy({where: {id: req.params.id}})
        res.redirect('/')
    },
    restauracion: async function (req, res) {
        const productoRestaurado = await juegos.restore({where: {id: req.params.id}})
        res.redirect('/')
    },
    //categorias
    novedades: async (req, res)=>{
        let productosNoDelete = await db.Juego.findAll({
            order: [['fecha', 'ASC' ]],
            limit: 12
        })
        res.render('./products/novedades',{productos: productosNoDelete})
    },
    accion: async (req, res)=>{
        let productosNoDelete = await db.Juego.findAll({
            where: {id_genero: 2},
            limit: 12
        })
        res.render('./products/accion',{productos: productosNoDelete})
    },
    aventuras: async (req, res)=>{
        let productosNoDelete = await db.Juego.findAll({
            where: {id_genero: 1},
            limit: 12
        })
        res.render('./products/aventuras',{productos: productosNoDelete})
    },
    mmo: async (req, res)=>{
        let productosNoDelete = await db.Juego.findAll({
            where: {id_genero: 3},
            limit: 12
        })
        res.render('./products/mmo',{productos: productosNoDelete})
    },
    deportes: async (req, res)=>{
        let productosNoDelete = await db.Juego.findAll({
            where: {id_genero: 6},
            limit: 12
        })
        res.render('./products/deportesyCarreras',{productos: productosNoDelete})
    },
    estrategia: async (req, res)=>{
        let productosNoDelete = await db.Juego.findAll({
            where: {id_genero: 4},
            limit: 12
        })
        res.render('./products/estrategia',{productos: productosNoDelete})
    },
    cooperativos: async (req, res)=>{
        let productosNoDelete = await db.Juego.findAll({
            where: {id_genero: 5},
            limit: 12
        })
        res.render('./products/cooperativos',{productos: productosNoDelete})
    },

    // --- Agregado: Buscador funcional ---
    search: async (req, res) => {
        // El parámetro de búsqueda viene como "q"
        const query = req.query.q || '';
        // Búsqueda por nombre (no importa mayúsculas/minúsculas, ni nombre exacto)
        const juegosEncontrados = await db.Juego.findAll({
            where: {
                nombre: {
                    [Op.like]: `%${query}%`
                }
            }
        });
        res.render('products/searchResults', { juegos: juegosEncontrados, query });
    },
}

module.exports = productController;