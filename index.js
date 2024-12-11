const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const cors= require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connectDB = require('./db/connections');
connectDB();
app.use('/', require('./router/routes'));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});