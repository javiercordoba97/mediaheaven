const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.home );
router.get('/detalle1984/:id', mainController.detalle);
router.get('/register', mainController.register );
router.get('/login', mainController.login );
router.get('/cart', mainController.cart );
router.get('/edicion/:id', mainController.edicion );
router.get('/creacion', mainController.creacion );

router.post('/creacion',mainController.crearProcess)

router.put('/edicion/:id',mainController.editarProcess)
/*router.get('/productRedDead2', mainController.productRedDead2 );
router.get('/productHorizon', mainController.productHorizon );
router.get('/productAssassins', mainController.productAssassins );
router.get('/productWitcher', mainController.productWitcher );

router.get('/productDonQuijote', mainController.productDonQuijote );
router.get('/productOdisea', mainController.productOdisea );
router.get('/productCrimen', mainController.productCrimen );
router.get('/product1984', mainController.product1984 );
*/
module.exports = router;