const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/applicantreport', forwardAuthenticated, async (req, res) =>{
    
res.render('applicantreport',{});
});
router.get('/newsreport', forwardAuthenticated, async (req, res) =>{

res.render('newsreport',{});
});
router.get('/jobreport', forwardAuthenticated, async (req, res) =>{

    res.render('jobreport',{});
    });

module.exports = router;