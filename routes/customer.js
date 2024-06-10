const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createnewstagorcategroy', ensureAuthenticated, async (req, res) =>{
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
    res.render('createnewstagorcategroy',{user:req.user,newscategory:newscategory,newstag:newstag});
    });
    
router.get('/mainsubjobcategory', ensureAuthenticated, async (req, res) =>{  
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
    res.render('createmainsubjobcategory',{user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
    });
router.post('/addmainjobcategory',ensureAuthenticated,async function(req,res){
const {mainjobcategory} = req.body;
const jobmaincategory = await db.Category.findAll({})
const jobsubcategory  = await db.Subcategory.findAll({})
if(!mainjobcategory){
    res.render('createmainsubjobcategory',{error_msg:'Please add main job category name first.',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
}else{
    const catData ={
        catid: uuidv4(),
      catname: mainjobcategory,
      is_active:'Yes'
    }
    db.Category.create(catData).then(catdt =>{
     if(catdt){
    db. Category.findAll({}).then(newcat =>{
        res.render('createmainsubjobcategory',{success_msg:'Successfully add main job category',user:req.user,jobmaincategory:newcat,jobsubcategory:jobsubcategory});

    }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while creating job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});

    })
     }
    }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while creating job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});

    })
  }

});
router.post('/addsubjobcategory',ensureAuthenticated,async function(req,res){
    const {mainjobcategory,subcatname} = req.body;
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
    if(!mainjobcategory ||!subcatname || mainjobcategory ==="0"){
        res.render('createmainsubjobcategory',{error_msg:'Please add all required fields',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
    }else{
        const catData ={
            subcatid: uuidv4(),
            catid: mainjobcategory,
          is_active:'Yes',
          subcatname:subcatname
        }
        db.Subcategory.findOne({where:{subcatname:subcatname}}).thne(subcat =>{
            if(subcat){
                res.render('createmainsubjobcategory',{error_msg:'Error Sub category already register with this name',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
            }else{
                db.Subcategory.create(catData).then(catdt =>{
                    if(catdt){
                   db.Subcategory.findAll({}).then(newcat =>{
                       res.render('createmainsubjobcategory',{success_msg:'Successfully add sub job category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:newcat});
               
                   }).catch(err =>{
                       res.render('createmainsubjobcategory',{error_msg:'Error while creating job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
                   })
                    }
                   }).catch(err =>{
                       res.render('createmainsubjobcategory',{error_msg:'Error while creating job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
                   })
            }
        }).catch(err =>{
            res.render('createmainsubjobcategory',{error_msg:'Error while creating job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
        })
      
      }
});
router.post('/addnewstag',ensureAuthenticated,async function(req,res){
    const {newstags} = req.body;
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
   if(!newstag){
    res.render('createnewstagorcategroy',{error_msg:'Please add all required fields',user:req.user,newscategory:newscategory,newstag:newstag});
  
    }else{
        const catData ={
        
            ncatid:uuidv4(),
          ntagname: newstags,
          is_active:'Yes'
        }
        db.NewsTag.create(catData).then(catdt =>{
         if(catdt){
        db.NewsTag.findAll({}).then(newcat =>{
            res.render('createnewstagorcategroy',{success_msg:'Successfully create NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while finding existing NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        })
         }
        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while creating NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});
 
        })
      }
});

router.post('/addnewscategroy',ensureAuthenticated,async function(req,res){
    const {newscategorys} = req.body;
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
   if(!newstag){
    res.render('createnewstagorcategroy',{error_msg:'Please add all required fields',user:req.user,newscategory:newscategory,newstag:newstag});
  
    }else{
        const catData ={
        
            ncatid:uuidv4(),
            ncatname: newscategorys,
            is_active:'Yes'
        }
        db.NewsCategory.create(catData).then(catdt =>{
         if(catdt){
        db.NewsCategory.findAll({}).then(newcat =>{
            res.render('createnewstagorcategroy',{success_msg:'Successfully create NEWS category',user:req.user,newscategory:newcat,newstag:newstag});

        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while finding existing NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        })
         }
        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while creating NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        })
      }
}); 

module.exports = router;