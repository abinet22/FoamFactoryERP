const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const fs = require('fs');
const path = require("path");
const Newsphoto = require('../middleware/totphoto');
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createnewemployee',ensureAuthenticated,async function(req,res){
 const position = await db.Position.findAll({});
 res.render('createnewemployee',{position:position,user:req.user})
})
router.get('/employeelist',ensureAuthenticated,async function(req,res){
    const [empllist,elm] = await db.sequelize.query(`
    select * from Employees inner join Positions on Employees.position = Positions.positionid
    `)
    res.render('employeelist',{empllist:empllist,user:req.user})
   })
router.post('/addnewemployee',ensureAuthenticated,Newsphoto.single('empphoto'),async function(req,res){
const {fullname,phone,salary,overtimerate,bonusrate,address,position,emptype,paytype} = req.body;
let errors = [];
const positionlist = await db.Position.findAll({});
if(!fullname ||!phone ||!salary ||!overtimerate ||!bonusrate ||!address ||!position ||!emptype ||!paytype){
   errors.push({msg:'please add all required fields'})
}
if(!req.file){
    errors.push({msg:'please add all employee photo or ID '})
}
if(position ==="0"){
    errors.push({msg:'please select employee position '})
}
if(errors.length >0){

    res.render('createnewemployee',{errors,position:positionlist,user:req.user})
}
else{
    const catData ={
       
        cusid: uuidv4(),
      fullname:fullname,
      phone_number:phone,
      salary: parseFloat(salary),
      emptype:emptype,
      position:position,
      address: address,
      empphoto: fs.readFileSync(
        path.join(__dirname,'../public/uploads/') + req.file.filename
      ),
  
      bonusrate:parseFloat(bonusrate),
      overtimerate: parseFloat(overtimerate),
      salarytype: paytype,
      isactive:'Yes'
    }
   
    db.Employee.findOne({where:{phone_number:phone,fullname:fullname}
    }).then(emp =>{
if(emp){
    console.log(catData)
    res.render('createnewemployee',{error_msg:'This employee already registered change name or phone number',position:positionlist,user:req.user})
    
}else{ 
    db.Employee.create(catData).then(catdt =>{
        if(catdt){
           res.render('createnewemployee',{success_msg:'Successfully registered new emplyee ',position:positionlist,user:req.user})
        }
       }).catch(err =>{
        console.log(err)
           res.render('createnewemployee',{error_msg:'Error while creating employee info',position:positionlist,user:req.user})
       })
}
    }).catch(err =>{
        console.log(err)
        res.render('createnewemployee',{error_msg:'Error while creating employee info',position:positionlist,user:req.user})
     
    })
  
  }

});
 

module.exports = router;