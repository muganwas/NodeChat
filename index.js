require('dotenv').config();
const express = require('express');
const BodyParser = require('body-parser');
const BaseRoutes = require('./API/Routes/BaseRoutes');
const path = require('path');
const Routes = BaseRoutes.Routes;
const App = express();
const Port = process.env.PORT || 3000;

App.use(express.json());
App.use(express.static(path.join(__dirname, 'public/')));
App.use(BodyParser.urlencoded({extended:true}));
Routes(App);
App.listen(Port, ()=>{
    console.log(`Server started, listening at port ${Port}`);
})