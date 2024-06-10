const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');

router.get('/productrequest', ensureAuthenticated, async (req, res) =>{
const  productrequest = await db.ProductRequest.findAll({where:{status:'Sent'}});
const  [shoplist,slm] = await db.sequelize.query(`
select * from Shops inner join Inventories on shopid = warehouseid  
`)
console.log(productrequest)
const  [warelist,wlm] = await db.sequelize.query(`
select * from Warehouses inner join Inventories on Warehouses.warehouseid = Inventories.warehouseid
`)
const shops = await db.Shop.findAll({});
const wares = await db.Warehouse.findAll({});
  res.render('productrequest',{shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});

});
router.post('/acceptproductrequest/(:productrequestid)',ensureAuthenticated,async function(req,res){
  const {shopwareid,totalamount} =req.body;
  const  productrequest = await db.ProductRequest.findAll({where:{status:'Sent'}});
  const  [shoplist,slm] = await db.sequelize.query(`
  select * from Shops inner join Inventories on shopid = warehouseid  
  `)
  console.log(productrequest)
  const  [warelist,wlm] = await db.sequelize.query(`
  select * from Warehouses inner join Inventories on Warehouses.warehouseid = Inventories.warehouseid
  `)
  const shops = await db.Shop.findAll({});
  const wares = await db.Warehouse.findAll({});

  db.ProductRequest.findOne({where:{prid:req.params.productrequestid}}).then(pr =>{
   if(pr){
    
      db.ProductRequest.update({status:'Accepted',sentfrom:shopwareid,sentamount:totalamount},{where:{prid:req.params.productrequestid}}).then(upr =>{
       if(upr){
        db.ProductRequest.findAll({where:{status:'Sent'}}).then(nuprl =>{
          res.render('productrequest',{success_msg:'Successfully update product request: Accepted',shops:shops,wares:wares,user:req.user,productrequest:nuprl,shoplist:shoplist,warelist:warelist});
  
        }).catch(err =>{
        res.render('productrequest',{error_msg:'Error while finding updated  request list',shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});
  
      })
       }
      }).catch(err =>{
        res.render('productrequest',{error_msg:'Error while updating this request',shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});
  
      })
   }else{
    res.render('productrequest',{error_msg:'Error while finding this request',shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});
  
   }
  }).catch(err =>{
    res.render('productrequest',{error_msg:'Error while finding this request',shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});
  
  })
 
})
router.post('/rejectproductrequest/(:prid)',ensureAuthenticated,async function(req,res){
  const  productrequest = await db.ProductRequest.findAll({where:{status:'Sent'}});
const  [shoplist,slm] = await db.sequelize.query(`
select * from Shops inner join Inventories on shopid = warehouseid  
`)
console.log(productrequest)
const  [warelist,wlm] = await db.sequelize.query(`
select * from Warehouses inner join Inventories on Warehouses.warehouseid = Inventories.warehouseid
`)
const shops = await db.Shop.findAll({});
const wares = await db.Warehouse.findAll({});

  db.ProductRequest.findOne({where:{prid:req.params.prid}}).then(oldpr =>{
    if(oldpr){
      db.ProductRequest.update({status:'Rejected'},{where:{prid:req.params.prid}}).then(upr =>{
        db.ProductRequest.findAll({where:{status:'Sent'}}).then(newpr =>{
          res.render('productrequest',{success_msg:'Successfully reject product request ',shops:shops,wares:wares,user:req.user,productrequest:newpr,shoplist:shoplist,warelist:warelist});

        }).catch(err =>{
          res.render('productrequest',{shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});

        })
      })
    }else{
      res.render('productrequest',{shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});

    }
   
  }).catch(err => {
    console.log(err)
    res.render('productrequest',{error_msg:'Error while rejecting product request ',shops:shops,wares:wares,user:req.user,productrequest:productrequest,shoplist:shoplist,warelist:warelist});

  })
})

module.exports = router;