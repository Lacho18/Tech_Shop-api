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


//Routes that handle the http requests or CRUD operations to the database
app.use('/user', require('./routes/UsersRoute'));

app.use('/product', require("./routes/ProductsRoute"));

app.use('/characteristics', require("./routes/Characteristics"));

app.use('/comments', require("./routes/CommentsRoute"));

app.use('/allUsers', require("./routes/AllUsers"));

app.use('/purchase', require("./routes/PurchaseRoute"));

app.all('*', (req, res) => {
  res.status(404).json({message : "Not a valid URL!"});
})

app.listen(PORT, () => {
    console.log("Server running on port : " +PORT);
});