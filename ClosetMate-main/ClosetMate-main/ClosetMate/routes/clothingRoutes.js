const express = require('express');
const router = express.Router();
const clothingModel = require('./clothingModel');

function authenticate(req, res, next) {
  // For demo, assume user ID 1 is logged in
  req.user = { id: 1 };
  next();
}

router.use(authenticate);

//Get all clothing items for the logged-in user
router.get('/', async (req, res) => {
  try {
    const items = await clothingModel.getClothingItemsByUser (req.user.id);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clothing items' });
  }
});

//Get a single clothing item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await clothingModel.getClothingItemById(req.user.id, req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clothing item' });
  }
});

// Add a new clothing item
router.post('/', async (req, res) => {
  try {
    const newItemId = await clothingModel.addClothingItem(req.user.id, req.body);
    res.status(201).json({ message: 'Clothing item added', itemId: newItemId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add clothing item' });
  }
});

//Update a clothing item
router.put('/:id', async (req, res) => {
  try {
    const success = await clothingModel.updateClothingItem(req.user.id, req.params.id, req.body);
    if (!success) return res.status(404).json({ error: 'Item not found or no changes made' });
    res.json({ message: 'Clothing item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update clothing item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await clothingModel.deleteClothingItem(req.user.id, req.params.id);
    if (!success) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Clothing item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete clothing item' });
  }
});

module.exports = router;