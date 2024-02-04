const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./middleware/connectDB');
const getAllUsers = require('./controller/getAllUsers');
const { default: mongoose } = require('mongoose');
const Comments = require('./models/Comments');

const PORT = 5000;

app.use(cors());

app.use(bodyParser.json());

connectDB();

app.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).send("Internal Server Error");
    } 
});

app.use('/login', require('./routes/Login'));

app.use('/create', require("./routes/AccountCreation"));

app.use('/product', require("./routes/ProductsRoute"));

app.use('/characteristics', require("./routes/Characteristics"));

app.use('/comments', require("./routes/CommentsRoute"));

app.all('*', (req, res) => {
  res.status(404).json({message : "Not a valid URL!"});
})

app.listen(PORT, () => {
    console.log("Server running on port : " +PORT);
});