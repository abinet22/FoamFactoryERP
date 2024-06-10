const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
router.get('/createuser', ensureAuthenticated, async (req, res) =>{
    const emplist = await db.Employee.findAll({});
    const shoplist = await db.Shop.findAll({});
    const warehouselist = await db.Warehouse.findAll({});
res.render('createuser',{user:req.user,emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});
});
router.get('/userlist', ensureAuthenticated, async (req, res) =>{
const [users,ulm] = await db.sequelize.query(`

SELECT * FROM Users
INNER JOIN Shops ON Shops.shopid = Users.shopid
UNION
SELECT * FROM Users
INNER JOIN Warehouses ON Warehouses.warehouseid = Users.wareid;
`)
res.render('userlist',{user:req.user,users:users});
});
router.post('/activateuser/(:userid)', ensureAuthenticated, async (req, res) =>{
  const users = await db.User.findAll({});
  db.User.findOne({where:{staffid:req.params.userid}}).then(userex =>{
    if(userex){
       db.User.update({is_active:'Yes'},{where:{staffid:req.params.userid}}).then(udtusr =>{
        if(udtusr){
          db.User.findAll({}).then(udtnewuser =>{
            res.render('userlist',{success_msg:'User status updated account is activated',user:req.user,users:udtnewuser});

          }).catch(err =>{
            res.render('userlist',{error_msg:'Error while finding updated user list',user:req.user,users:users});
          })
        }
       }).catch(err =>{
        res.render('userlist',{error_msg:'Error while updating existing user',user:req.user,users:users});
      })
    }else{
      res.render('userlist',{error_msg:'Existing user cant be found',user:req.user,users:users});

    }
  }).catch(err =>{
    res.render('userlist',{error_msg:'Error while finding existing user',user:req.user,users:users});
  })

  });
  router.post('/diactivateuser/(:userid)', ensureAuthenticated, async (req, res) =>{
    const users = await db.User.findAll({});
    db.User.findOne({where:{staffid:req.params.userid}}).then(userex =>{
      if(userex){
         db.User.update({is_active:'No'},{where:{staffid:req.params.userid}}).then(udtusr =>{
          if(udtusr){
            db.User.findAll({}).then(udtnewuser =>{
              res.render('userlist',{success_msg:'User status updated account is deactivated',user:req.user,users:udtnewuser});
  
            }).catch(err =>{
              res.render('userlist',{error_msg:'Error while finding updated user list',user:req.user,users:users});
            })
          }
         }).catch(err =>{
          res.render('userlist',{error_msg:'Error while updating existing user',user:req.user,users:users});
        })
      }else{
        res.render('userlist',{error_msg:'Existing user cant be found',user:req.user,users:users});
  
      }
    }).catch(err =>{
      res.render('userlist',{error_msg:'Error while finding existing user',user:req.user,users:users});
    })
  
    });
router.post('/createuser', ensureAuthenticated, async (req, res) =>{
 const {password,username,fullname,repassword,userroll,wareid,shopid} =req.body;
 const emplist = await db.Employee.findAll({});
 const shoplist = await db.Shop.findAll({});
 const warehouselist = await db.Warehouse.findAll({});
  let errors =[];
  if(userroll === "0"){
    errors.push({msg:'Please select user roll'}) 
  }
  if(password != repassword){
    errors.push({msg:'Password and retype password must be the same'}) 
  }
  if(userroll === 'Sales_Manager' && !shopid){
    errors.push({msg:'Please select shop name'}) 
  }
  if(userroll === 'Sales_Manager' &&  shopid ==="0"){
    errors.push({msg:'Please select shop name'}) 
  }
  if(userroll === 'Inventory_Manager' && !wareid ){
    errors.push({msg:'Please select warehouse name'}) 
  }
  if(userroll === 'Inventory_Manager' &&  wareid ==="0"){
    errors.push({msg:'Please select warehouse name'}) 
  }
  if(!password |!repassword ||!username  ||!fullname ||!repassword ||!userroll){
    errors.push({msg:'Please enter all required fields'}) 
  }
  if(errors.length>0){
    res.render('createuser',{errors,user:req.user,emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});  
  }
  else{
    db.Employee.findOne({where:{cusid:fullname}}).then(emp =>{
      if(emp){
       
        console.log(emp.fullname)
        const userData ={
          staffid: fullname,
        fullname: emp.fullname,
        wareid:wareid,
      shopid:shopid,
        phone_number: emp.phone_number,
        username: username,
        password:password,
        user_roll: userroll,
       
        is_active: 'Yes'
        }
        bcrypt.hash(password, 10, (err, hash) => {
          userData.password = hash;
      
      
         db.User.findOne({where:{username:username}}).then(usr =>{
         if(usr){
          res.render('createuser',{user:req.user,error_msg:'Error username already registered! Please change username.',emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});
          
         }else{
          db.User.create(userData).then(usernew =>{
            if(usernew){
               res.render('createuser',{user:req.user,success_msg:'Successfully Created',emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});   }else{
               res.render('createuser',{user:req.user,error_msg:'Error while creating users credentials',emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});  }
              }).catch(err =>{
               console.log(err)
               res.render('createuser',{user:req.user,error_msg:'Cant create user now please try again',emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});
               })
         }
         }).catch(err =>{
         res.render('createuser',{user:req.user,error_msg:'Cant create user now please try again',emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});
               
         })
          }); // 
      }else{
     res.render('createuser',{user:req.user,error_msg:'Cant find employee with this ID',emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});  
       
      }
    }).catch(err =>{
      console.log(err)
      res.render('createuser',{user:req.user,error_msg:'Error while finding employee data',emplist:emplist,warehouselist:warehouselist,shoplist:shoplist});  
    })
   
  }
});
module.exports = router;