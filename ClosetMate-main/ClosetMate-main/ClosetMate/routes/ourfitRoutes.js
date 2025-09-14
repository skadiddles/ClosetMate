const express = require('express');
const router = express.Router();
const outfitModel = require('./outfitModel');

// Get all outfits for user
router.get('/', async (req, res) => {
  try {
    const outfits = await outfitModel.getOutfitsByUser (req.user.id);
    res.json(outfits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch outfits' });
  }
});

// Get outfit by ID
router.get('/:id', async (req, res) => {
  try {
    const outfit = await outfitModel.getOutfitById(req.user.id, req.params.id);
    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
    res.json(outfit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch outfit' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const outfitId = await outfitModel.createOutfit(req.user.id, name, description);
    res.status(201).json({ message: 'Outfit created', outfitId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create outfit' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const success = await outfitModel.updateOutfit(req.user.id, req.params.id, req.body);
    if (!success) return res.status(404).json({ error: 'Outfit not found or no changes made' });
    res.json({ message: 'Outfit updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update outfit' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await outfitModel.deleteOutfit(req.user.id, req.params.id);
    if (!success) return res.status(404).json({ error: 'Outfit not found' });
    res.json({ message: 'Outfit deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete outfit' });
  }
});

module.exports = router;
