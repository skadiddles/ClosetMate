const express = require('express');
const router = express.Router();
const userPreferencesModel = require('./userPreferencesModel');

// Get all preferences for user
router.get('/', async (req, res) => {
  try {
    const prefs = await userPreferencesModel.getPreferencesByUser (req.user.id);
    res.json(prefs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: 'key and value are required' });

    const result = await userPreferencesModel.upsertPreference(req.user.id, key, value);
    res.json({ message: 'Preference saved', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save preference' });
  }
});

router.delete('/:key', async (req, res) => {
  try {
    const deleted = await userPreferencesModel.deletePreference(req.user.id, req.params.key);
    if (!deleted) return res.status(404).json({ error: 'Preference not found' });
    res.json({ message: 'Preference deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete preference' });
  }
});

module.exports = router;