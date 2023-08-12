const express = require('express');
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { User, Course, Admin } = require("../db");
const router = express.Router();

module.exports = router