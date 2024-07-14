const express = require('express');
const { getAllDishes, toggleDishStatus } = require('../controllers/dishController');
const router = express.Router();

router.get('/dishes', getAllDishes);
router.post('/dishes/:id/toggle', toggleDishStatus);
module.exports = router;