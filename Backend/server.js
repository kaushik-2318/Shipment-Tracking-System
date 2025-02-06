require("dotenv").config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const shipmentRoutes = require('./src/routes/shipmentRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.use('/api', shipmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));