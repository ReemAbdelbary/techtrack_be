const recommend = require("../models/ReccomendModel");
const factory = require("../controllers/handlerFactory");

exports.getallrec = factory.getAll(recommend);
