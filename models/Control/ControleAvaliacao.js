const express = require("express");
const router = express();
const bodyParser = require("body-parser");
const Avaliacao = require("../Tables/Avaliacao");

router.use(bodyParser.urlencoded({extended:true}));

module.exports = router;