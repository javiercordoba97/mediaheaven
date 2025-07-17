const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController'); // <-- Importa el controlador de carrito
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = path.join(__dirname, '../../public/img/products');
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        let imageName = Date.now() + path.extname(file.originalname);
        cb(null, imageName);
    },
});
const uploadFile = multer({ storage });

// PRODUCTOS
router.get('/product/:id', productController.detalle);
router.get('/products/edicion/:id', productController.edicion);
router.get('/creacion', productController.creacion);
router.get('/restauracion', productController.restauracion);
router.get('/novedades', productController.novedades);
router.get('/accion', productController.accion);
router.get('/aventuras', productController.aventuras);
router.get('/mmo', productController.mmo);
router.get('/deportesyCarreras', productController.deportes);
router.get('/estrategia', productController.estrategia);
router.get('/cooperativos', productController.cooperativos);

router.post('/creacion', uploadFile.single("imagen"), productController.crearProcess);
router.put('/edicion/:id', uploadFile.single("imagen"), productController.editarProcess);
router.delete('/edicion/:id', productController.deleteProcess);

// CARRITO
router.get('/cart', cartController.cart); // <-- Usa el controlador de carrito
router.post('/cart/add/:id', cartController.add); // <-- Agregar al carrito
router.post('/cart/remove/:id', cartController.remove); // <-- Remover del carrito
router.post('/cart/checkout', cartController.checkout); // <-- Finalizar compra

module.exports = router;