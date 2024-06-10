const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const fs = require('fs');
const Op = db.Sequelize.Op;
const Newsphoto = require('../middleware/totphoto');
const { v4: uuidv4 } = require('uuid');
router.get('/createjob', ensureAuthenticated, async (req, res) =>{
  const jobmaincategory = await db.Category.findAll({})
  const jobsubcategory  = await db.Subcategory.findAll({})
res.render('createjob',{user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
});
router.get('/joblist', ensureAuthenticated, async (req, res) =>{
const joblist = await db.JobList.findAll({});
res.render('joblist',{user:req.user,joblist:joblist});
});
router.post('/createjob', ensureAuthenticated,Newsphoto.single('companylogo') ,async function(req, res){
    const {jobby,jobdetail,jobtype,experience,salary,placeofwork,deadline,jobtime,jobtitle,readmore,lon,lat,maincategory,subcategory,region,careerlevel} =req.body;
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
     let errors =[];
   
    if(!req.file){
      errors.push({msg:'Please add Company Logo Image file '}) 
    }
    if(jobtype ==="0"){
        errors.push({msg:'Please select job time '}) 
      }
    
      if(jobtime ==="0"){
        errors.push({msg:'Please select job type '}) 
      }
    
     if(!jobby ||!jobdetail ||!jobtype ||!experience ||!salary ||!placeofwork ||!deadline ||!jobtime ||!jobtitle ||!lon ||!lat ||!maincategory ||!subcategory ||!region ||!careerlevel){
       errors.push({msg:'Please enter all required fields'}) 
     }
     if(errors.length>0){
       res.render('createjob',{errors,user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});  
     }
     else{
       const jobsData ={
      
        jobid: uuidv4(),
    
        jobtitle:jobtitle,
        jobdetail:jobdetail,
        jobtime:jobtime,
        jobtype:jobtype,
        experience: experience,
        placeofwork: placeofwork,
        salary:salary,
        deadline:deadline,
        readmore:readmore,
        jobby: jobby,
        region: region,
      lat: lat,
      lon: lon,
      careerlevel:careerlevel,
      category: maincategory,
      subcategory:subcategory,
        companylogo: fs.readFileSync(
            path.join(__dirname,'../public/uploads/') + req.file.filename
          ),
    
       
       }
       console.log(jobsData);
       db.JobList.create(jobsData).then(usernew =>{
        if(usernew){
           res.render('createjob',{user:req.user,success_msg:'Successfully Created',jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});   }else{
           res.render('createjob',{user:req.user,error_msg:'Error while creating Job',jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});  }
          }).catch(err =>{
            console.log(err)
           res.render('createjob',{user:req.user,error_msg:'Cant Job now please try again',jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});  })
     }
   });

router.post('/deletejob/(:jobid)', ensureAuthenticated, async function(req, res){
    const joblist = await db.JobList.findAll({})
    db.JobList.findOne({where:{jobid:req.params.jobid}}).then(npid =>{
   if(npid){
    db.JobList.destroy({where:{jobid:req.params.jobid}}).then(dtnew =>{
      if(dtnew){
       db.JobList.findAll({}).then(newsudt =>{
         res.render('joblist',{success_msg:'Job updated successfully',user:req.user,joblist:newsudt});
       }).catch(err =>{
           res.render('joblist',{error_msg:'Cant find updated Job list',user:req.user,joblist:joblist});
         })
      }
     }).catch(err =>{
         res.render('joblist',{error_msg:'Cant delete Job please try again',user:req.user,joblist:joblist});
       })
   }
    }).catch(err =>{
      console.log(err)
      res.render('joblist',{error_msg:'Cant find Job with this id',user:req.user,joblist:joblist});
    })

    });
module.exports = router;