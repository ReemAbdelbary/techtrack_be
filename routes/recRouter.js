const express = require("express");

const router = express.Router();
const recControl = require("../controllers/recController");

//routers
router.route("/").get(recControl.getallrec);

module.exports = router;
