

const express = require("express");
const industryController = require("./../controllers/industryController");
const authController = require('./../controllers/authController')

const router = express.Router();

router.route("/").get(authController.protect,industryController.getAllIndustry).post(authController.protect, industryController.createIndustry);


router.route("/:id").get(authController.protect,industryController.getIndustry).patch(authController.protect,industryController.updateIndustry).delete(authController.protect,industryController.deleteIndustry);


module.exports = router;