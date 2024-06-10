const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/', forwardAuthenticated, async (req, res) =>{
res.render('login',{});
});
router.get('/dashboard', ensureAuthenticated, async (req, res) =>{
  const [inventorylist,ilmeta] = await db.sequelize.query(`
select * from Inventories inner join Warehouses on
Inventories.warehouseid = Warehouses.warehouseid
where Inventories.warehouseid ='${req.user.wareid}'
`) 
const [inventoryalert,ialertm] = await db.sequelize.query(`
select * from Inventories 
where  Inventories.totamount <= 200 and warehouseid ='${req.user.wareid}'
`)
const [inventoryalert2,ialertm2] = await db.sequelize.query(`
select * from Inventories 
where  Inventories.totamount <= 2 and warehouseid ='${req.user.wareid}'
`)  
const [inventoryalert3,ialertm3] = await db.sequelize.query(`
select * from ProductRequests 
where  requsetby ='${req.user.wareid}' and status='ApprovedSent'
`)  
const [adminalert,alaertm] = await db.sequelize.query(`
select * from ProductRequests 
where  status='Sent'
`) 
const [adminalert2,alaertm2] = await db.sequelize.query(`
select * from Inventories 
where  Inventories.totamount <= 200 
`) 
const [adminstatinventory,alarma3] = await db.sequelize.query(`
select * from Inventories 
`) 
    res.render('index',{user:req.user,
      adminstatinventory:adminstatinventory,
      inventorylist:inventorylist,
      inventoryalert:inventoryalert,
      inventoryalert2:inventoryalert2,
      adminalert:adminalert,
      adminalert2:adminalert2,
      inventoryalert3:inventoryalert3
    });
    });
              
                                
router.get('/login', forwardAuthenticated, async (req, res) =>{
res.render('login');
});

router.get('/logout', (req, res) => {
    // Use req.logout with a callback function
    req.logout((err) => {
      if (err) {
        console.error("Error occurred during logout:", err);
        // Handle the error, if needed
      } else {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
      }
    });
  });
// Logout
router.get('/logout', (req, res) => {
req.logout();
req.flash('success_msg', 'You are logged out');
res.redirect('/login')

})

// Post Routers 
router.post('/login', (req, res, next) => {


passport.authenticate('local', {
successRedirect: '/dashboard',
failureRedirect: '/login',
failureFlash: true

})(req, res, next);
});
module.exports = router;