# Tech_Shop
This is a server side application that builds the code which handles the request that comes from the frontend side of this project (Frontend side - https://github.com/Lacho18/Tech_Shop). This api uses this technologies - Node.js, Express.js. For a database it uses a not relational data base MongoDB.

## How to start
# Necessary instalations
This api uses Node.js. In order to be started Node.js must be installed on the local machine
It can be installed from here - https://nodejs.org/en/download.
To check if the installation is complete on a Command Prompt write these two commands
node -v
npm -v
They should return the vershions, which means that the instalation is successful.

In this project is used as database MongoDB. In order for this code to connect to the database it needs a MongoDB Server.
The MongoDB Server can be installed from here - https://www.mongodb.com/try/download/community.

To visually control the data, it is necessary to install the MongoDB graphical user interface (GUI) - Compass. MongoDB Compass provides a visual representation of your databases, collections, documents, and queries, making it easier for developers and administrators to work with MongoDB.
MongoDB Compass can be installed from here - https://www.mongodb.com/try/download/shell.

# Process of starting
The MongoDB Server should be started.
Save this project in a folder. Then open a Command Prompt. By using the cd command navigate to the folder where the index.js file is located (example : cd C:\Desktop\Tech_shop-api). After that write this command
npm start
If everything is fine on the console should be written "Server running on port : 5000" and if the connection with the database is complete "Connection complite !". If these two messages show and there is not errors the api is started and can handle the request= All request comes from the frontend side application.

## Routes list
| Method | URL | Action |
---------------------------------------------------------------------------
|GET| http://localhost:5000/user | Finds an user and returns its object as result |
---------------------------------------------------------------------------
|POST| http://localhost:5000/user | Creates a new user in the database |
---------------------------------------------------------------------------
|DELETE| http://localhost:5000/user | Deletes an user from the database |
---------------------------------------------------------------------------
|GET| http://localhost:5000/product | Sends data for a type of product and returns every product with the given type |
---------------------------------------------------------------------------
|POST| http://localhost:5000/product | Creates a new product in the database |
---------------------------------------------------------------------------
|DELETE| http://localhost:5000/product | Deletes a product from the database |
---------------------------------------------------------------------------
|GET| http://localhost:5000/comments | Gets 10 comments depending on the product id and the number of the current page |
---------------------------------------------------------------------------
|POST| http://localhost:5000/comments | Creates a new comment in the database |
---------------------------------------------------------------------------
|PUT| http://localhost:5000/comments | Allows a user to change it's own comment |
---------------------------------------------------------------------------
|DELETE| http://localhost:5000/comments | Deletes a comment from the database |
---------------------------------------------------------------------------