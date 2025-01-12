const express = require('express');
const bodyParser = require('body-parser');
const bidRoutes = require('./routes/bidRoutes');

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Routes
app.use('/bid', bidRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})