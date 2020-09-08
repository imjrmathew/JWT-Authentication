const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const apiroutes = require('./routes/authentication');
dotenv.config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology:true }, () => console.log("Connected to db"));

app.use(express.json());
app.use('/api', apiroutes);

app.listen(3000, () => console.log("Server Running"));