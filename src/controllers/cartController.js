const db = require("../database/models");
const juegos = db.Juego;

const cartController = {
    cart: async (req, res) => {
        if (!req.session.cart) req.session.cart = [];
        // Busca los productos por ID
        const ids = req.session.cart.map(j => j.id);
        let productosCarrito = [];
        if (ids.length > 0) {
            productosCarrito = await juegos.findAll({ where: { id: ids } });
            productosCarrito = productosCarrito.map(prod => {
                const prodCart = req.session.cart.find(j => j.id == prod.id);
                return { ...prod.dataValues, descuento: prodCart.descuento || 0 };
            });
        }
        res.render('products/cart', { cart: productosCarrito });
    },
    add: async (req, res) => {
        if (!req.session.cart) req.session.cart = [];
        const id = req.params.id;
        const producto = await juegos.findByPk(id);
        if (!producto) return res.redirect('/');
        // Evita duplicados
        if (!req.session.cart.some(j => j.id == producto.id)) {
            req.session.cart.push({ id: producto.id, descuento: producto.descuento || 0 });
        }
        res.redirect('/cart');
    },
    remove: (req, res) => {
        const id = req.params.id;
        if (!req.session.cart) req.session.cart = [];
        req.session.cart = req.session.cart.filter(j => j.id != id);
        res.redirect('/cart');
    },
    checkout: (req, res) => {
        req.session.cart = [];
        res.render('products/cart', { cart: [], mensaje: '¡Compra realizada con éxito!' });
    }
};

module.exports = cartController;