'use strict'
const ChatController = require('../Controllers/ChatController');
const landing = ChatController.landing;
module.exports.Routes = app => {
    app.get('/chat', landing);
}