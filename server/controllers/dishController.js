const Dish = require("../models/dishModel");

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    //console.log("Fetched dishes:", dishes); // 
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};

const toggleDishStatus = async (req, res) => {
    try {
      const dish = await Dish.findOne({ dishId: req.params.id });
      if (dish) {
        dish.isPublished = !dish.isPublished;
        await dish.save();
        req.io.emit('dishStatusChanged', dish); // Emit the updated dish status
        res.json(dish);
      } else {
        res.status(404).json({ error: 'Dish not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle dish status' });
    }
  };
module.exports = {
  getAllDishes,
  toggleDishStatus
};
