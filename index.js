const express = require('express');
const bodyParser = require('body-parser');
const bidRoutes = require('./routes/bidRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: ['http://localhost:3000'],
};
  
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Routes
app.use('/bidInfo', bidRoutes);
app.use('/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})