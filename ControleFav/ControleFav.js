const express = require("express");
const router =  express();
const bodyParser = require("body-parser");
const Fav = require("./Fav");

router.use(bodyParser.urlencoded({extended:true}));

module.exports = router;