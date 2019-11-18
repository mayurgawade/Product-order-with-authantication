const express = require('express')
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/product')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        //accepr the file
        cb(null, true)
    } else {
            //reject a file
      cb(null, false)
    }
}

const upload = multer({ storage : storage,
     limits: {
    fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter
});
const router = express.Router();
router.get('/', productController.product_get_all_products);
router.post('/', upload.single('productImage'), checkAuth, productController.product_create_product);
router.get('/:productId', productController.product_get_product_by_id)
router.patch('/:productId', checkAuth, productController.product_update_product)
router.delete('/:productId', checkAuth, productController.product_delete_product)
module.exports = router;