const express = require('express')
const app = express()
const db =require('./db');
require('dotenv').config();
const cors = require('cors')
const fileUploadRoutes = require('./fileUpload');

const bodyParser = require('body-parser')
app.use(bodyParser.json()); //req.body
app.use(cors());
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes')
//const candidateRoutes = require('./routes/candidateRoutes')

// to use module
app.use('/user', userRoutes)
//app.use('/candidate', candidateRoutes)
//app.use('/uploads', express.static('uploads'));
app.use('/user/profile', fileUploadRoutes);


app.listen(PORT, ()=>{
    console.log('Listening on port 3000')
})