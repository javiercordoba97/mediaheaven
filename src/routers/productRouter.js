const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
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

// --- BÚSQUEDA DE JUEGOS ---
router.get('/search', productController.search);

router.post('/creacion', uploadFile.single("imagen"), productController.crearProcess);
router.put('/edicion/:id', uploadFile.single("imagen"), productController.editarProcess);
router.delete('/edicion/:id', productController.deleteProcess);

// CARRITO
router.get('/cart', cartController.cart);
router.post('/cart/add/:id', cartController.add);
router.post('/cart/remove/:id', cartController.remove);
router.post('/cart/checkout', cartController.checkout);

module.exports = router;