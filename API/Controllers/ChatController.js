'use strict'
const path = require('path');
module.exports.landing = (req, res)=>{
    res.sendFile(path.join(__dirname, '../../public/'));
}