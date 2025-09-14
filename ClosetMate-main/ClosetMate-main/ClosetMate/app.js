const express = require('express');
const app = express();
app.use(express.json());

//authentication middlewar
const authenticate = require('./yourAuthMiddleware');
app.use(authenticate);

const routeManager = require('./routes/routeManager');
const userRoutes = require('./userRoutes');
const clothingRoutes = require('./clothingRoutes'); 
const outfitRoutes = require('./outfitRoutes');
const outfitItemsRoutes = require('./outfitItemsRoutes');
const userPreferencesRoutes = require('./userPreferencesRoutes');


app.use('/api/users', userRoutes);
app.use('/api/clothing', clothingRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/outfits', outfitItemsRoutes); 
app.use('/api/preferences', userPreferencesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
