const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const fs = require('fs');
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
const Newsphoto = require('../middleware/totphoto');
router.get('/addrowmaterial', ensureAuthenticated, async (req, res) =>{
  const materialname = await db.MaterialName.findAll({}) ;
  const warehouse = await db.Warehouse.findAll({where:{waretype:'Row_Material'}})
res.render('addrowmaterial',{user:req.user,materialname,materialname,warehouse:warehouse});
});
router.get('/rowmateriallist', ensureAuthenticated, async (req, res) =>{
const [rowmateriallist,rmlistmt] = await db.sequelize.query(`
select RowMaterials.rmid,RowMaterials.scaletype,RowMaterials.rowmaterialid,MaterialNames.rmtype,Warehouses.warehousename,RowMaterials.totamount,RowMaterials.unitmeasure,RowMaterials.rowmaterialname from RowMaterials
inner join MaterialNames on RowMaterials.rowmaterialid = MaterialNames.rmid
inner join Warehouses on Warehouses.warehouseid = RowMaterials.warehouseid
`
);
res.render('rowmateriallist',{user:req.user,rowmateriallist:rowmateriallist});
});
router.get('/rowmateriallog', ensureAuthenticated, async (req, res) =>{
  const [rowmateriallog,rmllist] = await db.sequelize.query(`
  select * from RowMaterialLogs
  inner join MaterialNames on RowMaterialLogs.rowmaterialid = MaterialNames.rmid
  
  `
  );
  res.render('rowmateriallog',{user:req.user,rowmateriallog:rowmateriallog});
  });
  router.post('/addnewrowmaterial', ensureAuthenticated, async (req, res) =>{
    const{matname,scaletype,unitmeasure,totalamount,wareid} = req.body;
    const materialname = await db.MaterialName.findAll({}) ;
    const warehouse = await db.Warehouse.findAll({where:{waretype:'Row_Material'}})
    const singlemat = await db.MaterialName.findOne({where:{rmid:matname}}) ;
    let errors =[];
   console.log(req.body)
if(!matname ||!scaletype ||!unitmeasure || !totalamount || !wareid){
    errors.push({msg:'Please enter all required feilds'})
}
if(!singlemat.rmname){
  errors.push({msg:'Cant find material with this ID'})
}
if(matname ==="0"){
errors.push({msg:'Please select material name'})
}
if(wareid ==="0"){
  errors.push({msg:'Please select warehouse name'})
  }
  if(scaletype ==="0"){
    errors.push({msg:'Please select scale type'})
    }
    if(unitmeasure ==="0"){
      errors.push({msg:'Please select unit of measurement'})
      }
if(errors.length >0 ){
  res.render('addrowmaterial',{errors,user:req.user,materialname,materialname,warehouse:warehouse});

}else{
    const matData ={
        rmid:uuidv4(),
        rowmaterialid: matname,
        rowmaterialname:singlemat.rmname,
        warehouseid :wareid,
        scaletype :scaletype,
        totamount :parseFloat(totalamount),
        unitmeasure : unitmeasure
    }
    db.RowMaterial.findOne({where:{rowmaterialid: matname,warehouseid:wareid}}).then(mat =>{
        if(mat){
          var existamt = parseFloat(mat.totamount);
          var rmid = mat.rmid;
          var addamt = parseFloat(totalamount);
          var newamt = existamt +addamt;
                db.RowMaterial.update({totamount:newamt},{where:{rowmaterialid:matname,warehouseid:wareid}}).then(mat =>{
                  db.RowMaterialLog.create({
                    rowmaterialid: matname,
                    sentfrom : 'Admin',
                    sentto : wareid,
                    totamount :totalamount,
                    actionmessage:'Row Material Amount Updated To Warehouse Measured in '+unitmeasure,
                    status:'Updated'
            
                }).then(rml =>{
                  res.render('addrowmaterial',{success_msg:'Successfully update row material amount to warehouse',user:req.user,materialname,materialname,warehouse:warehouse});
                
                }).catch(err =>{
                  res.render('addrowmaterial',{success_msg:'Successfully update row material amount to warehouse',user:req.user,materialname,materialname,warehouse:warehouse});
                
                })
                }).catch(er =>{
                    console.log(err)
                    res.render('addrowmaterial',{error_msg:'Error while updating row material amount in warehouse',user:req.user,materialname,materialname,warehouse:warehouse});
                })
          }else{
                db.RowMaterial.create(matData).then(mat =>{
                  db.RowMaterialLog.create({
                    rowmaterialid: matname,
                    sentfrom : 'Admin',
                    sentto : wareid,
                    totamount :totalamount,
                    actionmessage:'New Row Material Added To Warehouse Measured in '+unitmeasure,
                    status:'Added'
            
                }).then(rml =>{
                  res.render('addrowmaterial',{success_msg:'Successfully add row material to warehouse',user:req.user,materialname,materialname,warehouse:warehouse});

                }).catch(err =>{
                  res.render('addrowmaterial',{success_msg:'Successfully add row material to warehouse',user:req.user,materialname,materialname,warehouse:warehouse});

                })
                
                }).catch(er =>{
                    console.log(err)
                    res.render('addrowmaterial',{error_msg:'Error while add row material to warehouse try again',user:req.user,materialname,materialname,warehouse:warehouse});
                })
        }
    }).catch(er =>{
        console.log(err)
        res.render('addrowmaterial',{error_msg:'Error while finding existing row material in warehosue',user:req.user,materialname,materialname,warehouse:warehouse});
    })
}

  });
  router.post('/updaterowmaterial/(:rmid)',ensureAuthenticated,async function (req,res){
    const {totalamount,warehouseid,matname,unitmeasure} =req.body;
    const rmlistqry =`
    select RowMaterials.rmid,MaterialNames.rmtype,RowMaterials.warehouseid,Warehouses.warehousename,RowMaterials.totamount,RowMaterials.unitmeasure,RowMaterials.rowmaterialname from RowMaterials
    inner join MaterialNames on RowMaterials.rowmaterialid = MaterialNames.rmid
    inner join Warehouses on Warehouses.warehouseid = RowMaterials.warehouseid
    `
    const [rowmateriallist,rmlistmt] = await db.sequelize.query(rmlistqry);
 db.RowMaterial.findOne({where:{rmid:req.params.rmid,warehouseid:warehouseid}}).then(rm =>{
  if(rm){
    var existamt = parseFloat(rm.totamount);
  
    var addamt = parseFloat(totalamount);
    var newamt = existamt +addamt;
    db.RowMaterial.update({totamount:parseFloat(newamt)},{where:{rmid:req.params.rmid,warehouseid:warehouseid}}).then(udtrm =>{
     if(udtrm){
      console.log(udtrm)
      db.sequelize.query(rmlistqry).then(([results,metarst])=>{
        const udtproductprice = results;
        db.RowMaterialLog.create({
            rowmaterialid: matname,
            sentfrom : 'Admin',
            sentto : warehouseid,
            totamount :totalamount,
            actionmessage:'Row Material Amount Updated To Warehouse Measured in '+unitmeasure,
            status:'Updated'
    
        }).then(rml =>{
          res.render('rowmateriallist',{success_msg:'Successfully update row material amount in warehouse with this ID',user:req.user,rowmateriallist:udtproductprice});
       
        }).catch(err =>{
          res.render('rowmateriallist',{success_msg:'Successfully update row material amount in warehouse with this ID',user:req.user,rowmateriallist:udtproductprice});
       
        })
       
      }).catch(err =>{
        console.log(err)
  res.render('rowmateriallist',{error_msg:'Error while finding existing updated row material amount in warehouse with this ID',user:req.user,rowmateriallist:rowmateriallist});
 })
     }
    }).catch(err =>{
      console.log(err)
  res.render('rowmateriallist',{error_msg:'Error while updating existing row material amount in warehouse with this ID',user:req.user,rowmateriallist:rowmateriallist});
 })
  }else{
    res.render('rowmateriallist',{error_msg:'Error cant find row material with this ID',user:req.user,rowmateriallist:rowmateriallist});

  }
 }).catch(err =>{
  console.log(err)
  res.render('rowmateriallist',{error_msg:'Error while finding existing row material in warehouse with this ID',user:req.user,rowmateriallist:rowmateriallist});
 })

  })
module.exports = router;