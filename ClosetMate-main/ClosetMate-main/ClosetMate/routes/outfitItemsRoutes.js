const express = require('express');
const router = express.Router();
const outfitItemsModel = require('./outfitItemsModel');
const outfitModel = require('./outfitModel');

async function verifyOutfitOwnership(req, res, next) {
  try {
    const outfit = await outfitModel.getOutfitById(req.user.id, req.params.outfitId);
    if (!outfit) return res.status(404).json({ error: 'Outfit not found or access denied' });
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify outfit ownership' });
  }
}

// Add item to outfit
router.post('/:outfitId/items', verifyOutfitOwnership, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId is required' });

    const added = await outfitItemsModel.addItemToOutfit(req.params.outfitId, itemId);
    if (!added) return res.status(409).json({ error: 'Item already in outfit or error' });

    res.status(201).json({ message: 'Item added to outfit' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to outfit' });
  }
});

// Remove item from outfit
router.delete('/:outfitId/items/:itemId', verifyOutfitOwnership, async (req, res) => {
  try {
    const removed = await outfitItemsModel.removeItemFromOutfit(req.params.outfitId, req.params.itemId);
    if (!removed) return res.status(404).json({ error: 'Item not found in outfit' });
    res.json({ message: 'Item removed from outfit' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item from outfit' });
  }
});

// Get all items in an outfit
router.get('/:outfitId/items', verifyOutfitOwnership, async (req, res) => {
  try {
    const items = await outfitItemsModel.getItemsByOutfit(req.params.outfitId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch outfit items' });
  }
});

module.exports = router;
