const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/inventorylist', ensureAuthenticated, async (req, res) =>{
const [inventorylist,ilmeta] = await db.sequelize.query(`
select * from Inventories inner join Warehouses on
Inventories.warehouseid = Warehouses.warehouseid
where Inventories.warehouseid ='${req.user.wareid}'
`) 

res.render('invinventorylist',{user:req.user,inventorylist:inventorylist});
});
router.get('/inventorylist', ensureAuthenticated, async (req, res) =>{
const inventorylist = await db.Inventory.findAll({})

res.render('invinventorylist',{user:req.user,inventorylist:inventorylist});
});
router.get('/inventorylog', ensureAuthenticated, async (req, res) =>{
const inventorylog = await db.InventoryLog.findAll({})
const warelist = await db.Warehouse.findAll({})
const shoplist = await db.Shop.findAll({})
res.render('invinventorylog',{shoplist:shoplist,warelist:warelist,user:req.user,inventorylog:inventorylog});
});
router.get('/acceptproduct', ensureAuthenticated, async (req, res) =>{
    const acceptedproductrequest = await db.ProductRequest.findAll({where:{status:'Recieved',requsetby:req.user.wareid}})
    const acceptedproductqueue = await db.ProductRequest.findAll({where:{status:'AcceptedAndSent',transfercontroller:'Queue',requsetby:req.user.wareid}})
    console.log(acceptedproductqueue)
const warelist = await db.Warehouse.findAll({})
const shoplist = await db.Shop.findAll({})
res.render('invacceptproduct',{acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
});
router.get('/transferproduct', ensureAuthenticated, async (req, res) =>{
const acceptedtransferproductrequest = await db.ProductRequest.findAll({where:{sentfrom:req.user.wareid,status:'Accepted'}})
const warelist = await db.Warehouse.findAll({})
const shoplist = await db.Shop.findAll({})
res.render('invtransferproduct',{shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});

});
router.get('/sendproductrequest', ensureAuthenticated, async (req, res) =>{
const [productrequest,prm] = await db.sequelize.query(`
select * from ProductRequests where requsetby='${req.user.wareid}' and status='Sent'
`)
const warelist = await db.Warehouse.findAll({})
const shoplist = await db.Shop.findAll({})
 const [oldproductrequest,oprm] = await db.sequelize.query(`
    select * from ProductRequests where requsetby='${req.user.wareid}'and status !='Sent'
    `)
const productlist = await db.Product.findAll({})
const brandlist = await db.Brand.findAll({})
res.render('invsendproductrequest',{warelist:warelist,shoplist:shoplist,oldproductrequest:oldproductrequest,user:req.user,productlist:productlist,brandlist,productrequest:productrequest});
});

router.post('/sendproductrequest', ensureAuthenticated, async (req, res) =>{
    const{brandid,productid,amount} =req.body;
    const [productrequest,prm] = await db.sequelize.query(`
    select * from ProductRequests where requsetby='${req.user.wareid}' and status='Sent'
    `)
    const warelist = await db.Warehouse.findAll({})
const shoplist = await db.Shop.findAll({})
    const [oldproductrequest,oprm] = await db.sequelize.query(`
    select * from ProductRequests where requsetby='${req.user.wareid}' and status !='Sent'
    `)
    
    const productlist = await db.Product.findAll({})
    const brandlist = await db.Brand.findAll({})
    const pn = await db.Product.findOne({where:{productid:productid}})
    const bn = await db.Brand.findOne({where:{brandid:brandid}})
  
    let errors =[]
    if(productid ==="0"){
        errors.push({msg:'Please select product name'})
    }
    if(!productid || !amount){
        errors.push({msg:'Please enter all required fields'})
    }
    if(!pn || !bn){
        errors.push({msg:'Cant find product namd or brand with this IDs'})
    }
    if(errors.length >0){
        res.render('invsendproductrequest',{warelist:warelist,shoplist:shoplist,oldproductrequest:oldproductrequest,errors,user:req.user,productlist:productlist,brandlist,productrequest:productrequest});
       
    }else{
        const newPr={
            prid:uuidv4(),
            productid: productid,
            productname: pn.productname,
            productcode: pn.productcode,

            requsetby:req.user.wareid,
            brandid:brandid,
            brandname:bn.brandname,
            totamount :amount,
            status: 'Sent',
            
    }
        db.ProductRequest.create(newPr).then(npr =>{
            db.ProductRequest.findAll({where:{requsetby:req.user.wareid}}).then(newprlist=>{
                res.render('invsendproductrequest',{warelist:warelist,shoplist:shoplist,oldproductrequest:oldproductrequest,success_msg:'Successfully sent product request',user:req.user,productlist:productlist,brandlist,productrequest:newprlist});
       
            }).catch(err =>{
                console.log(err)
                res.render('invsendproductrequest',{warelist:warelist,shoplist:shoplist,oldproductrequest:oldproductrequest,success_msg:'Error while finding  new product request list. List not updated',user:req.user,productlist:productlist,brandlist,productrequest:productrequest});
       
            })
           
        }).catch(err =>{
            console.log(err)
            res.render('invsendproductrequest',{warelist:warelist,shoplist:shoplist,oldproductrequest:oldproductrequest,error_msg:'Error while creating new product.please request try again',user:req.user,productlist:productlist,brandlist,productrequest:productrequest});
       
        })
    }
 
    });

router.post('/acceptproduct/(:prid)', ensureAuthenticated, async (req, res) =>{
const acceptedproductrequest = await db.ProductRequest.findAll({where:{status:'Recieved',requsetby:req.user.wareid}})
const acceptedproductqueue = await db.ProductRequest.findAll({where:{status:'AcceptedAndSent',transfercontroller:'Queue',requsetby:req.user.wareid}})

const warelist = await db.Warehouse.findAll({})
const shoplist = await db.Shop.findAll({})

db.ProductRequest.findOne({where:{prid:req.params.prid,requsetby:req.user.wareid,status:'AcceptedAndSent'}}).then(opr =>{
if(opr){
    const sentfrom =opr.sentfrom;
    const sentamount =parseFloat(opr.sentamount);
    const productid =opr.productid;
    const brandid =opr.brandid;
    const brandname =opr.brandname;
    const productname =opr.productname;
    db.Inventory.findOne({where:{productid:productid,brandid:brandid,warehouseid:sentfrom}}).then(invent =>{
     if(invent){
       
        db.Inventory.findOne({where:{productid:productid,brandid:brandid,warehouseid:req.user.wareid}}).then(rin =>{
            if(rin){
                const extamt = parseFloat(rin.totamount);
                const newamt =extamt +sentamount;
               
           db.Inventory.update({totamount:newamt},{where:{productid:productid,brandid:brandid,warehouseid:req.user.wareid}}).then(uiamt =>{
            if(uiamt){
              
                const sndextamt =parseFloat(invent.totamount);
                const newamtsender =sndextamt - sentamount;
                db.Inventory.update({totamount:newamtsender},{where:{productid:productid,brandid:brandid,warehouseid:sentfrom}}).then(uisender =>{ 
                 db.ProductRequest.update({status:'Recieved',transfercontroller:'Delivered'},{where:{prid:req.params.prid}}).then(prud =>{
                      if(prud){
                        db.ProductRequest.findAll({where:{status:'AcceptedAndSent',requsetby:req.user.wareid}}).then(upre =>{
                            console.log(upre)
                            db.InventoryLog.create({
                                invid:uuidv4(),
                              productid: productid,
                          productname: productname,
                          brandname:brandname,
                          sentfrom :sentfrom,
                          sentto :req.user.wareid,
                          totamount :sentamount,
                          actionmessage:'Product Transfer From Sender To Receiver',
                          status:'Product Request Transfer'
                        

                               }).then(()=>{
                                res.render('invacceptproduct',{success_msg:'Successfully update inventory product amount and updated product request status:Product Recieved',acceptedproductqueue:upre,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
                          
                               }).catch(err =>{
                                res.render('invacceptproduct',{success_msg:'Successfully update inventory product amount and updated product request status:Product Recieved',acceptedproductqueue:upre,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
                          
                               })
                        }).catch(err =>{
                    res.render('invacceptproduct',{error_msg:'Error while finding updated  product request list',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
               
                   })
                      }
                 }).catch(err =>{
                    res.render('invacceptproduct',{error_msg:'Error while updating new product request status: Recieved',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
               
                   })

                }).catch(err =>{
                    res.render('invacceptproduct',{error_msg:'Error while updating new product with this brand in sender inventory',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
               
                   })
            
            }
           }).catch(err =>{
           res.render('invacceptproduct',{error_msg:'Error while updating existing product with this brand in your inventory',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
      
          })
            }else{
           db.Inventory.create({
            invid: uuidv4(),
            productid: productid,
            productname: productname,
            warehouseid: req.user.wareid,
            brandid:brandid,
            brandname:brandname,
            totamount:sentamount,
           }).then(icreate =>{
            if(icreate){
                db.Inventory.findOne({where:{productid:productid,brandid:brandid,warehouseid:sentfrom}}).then(oldint =>{
                 if(oldint){
                    const oldtotamt = parseFloat(oldint.totamount);
                    const newsndramt = oldtotamt -sentamount;
                    db.Inventory.update({totamount:newsndramt},{where:{productid:productid,brandid:brandid,warehouseid:sentfrom}}).then(uisender =>{ 
              
                        db.ProductRequest.update({status:'Recieved',transfercontroller:'Delivered'},{where:{prid:req.params.prid}}).then(prud =>{
                            if(prud){
                              db.ProductRequest.findAll({where:{status:'AcceptedAndSent',requsetby:req.user.wareid}}).then(upr =>{
                               db.InventoryLog.create({
                                invid:uuidv4(),
                              productid: productid,
                          productname: productname,
                          brandname:brandname,
                          sentfrom :sentfrom,
                          sentto :req.user.wareid,
                          totamount :sentamount,
                          actionmessage:'First Time Product Add To Inventory By Transfer From Sender To Receiver',
                          status:'Product Request Transfer'
                        

                               }).then(()=>{
                                res.render('invacceptproduct',{success_msg:'Successfully add new product with this brand in your inventory',acceptedproductqueue:upr,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
            
                               }).catch(err =>{
                                res.render('invacceptproduct',{success_msg:'Successfully add new product with this brand in your inventory',acceptedproductqueue:upr,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
            
                               })
                             
                              }).catch(err =>{
                          res.render('invacceptproduct',{error_msg:'Error while finding updated  product request list',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
                     
                         })
                            }
                       }).catch(err =>{
                          res.render('invacceptproduct',{error_msg:'Error while updating new product request status: Recieved',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
                     
                         })
                        }).catch(err =>{
                            res.render('invacceptproduct',{error_msg:'Error while updating new product request status: Recieved',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
                       
                           })
                 }
            
                }).catch(err =>{
                    res.render('invacceptproduct',{error_msg:'Error while updating new product request status: Recieved',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
               
                   })
            }
       
           }).catch(err =>{
       res.render('invacceptproduct',{error_msg:'Error while adding new product with this brand in your inventory',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
   
   })
            }
   }).catch(err =>{
       res.render('invacceptproduct',{error_msg:'Error cant find product with this brand in your inventory',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});
   
   })
     }
    }).catch(err =>{
    res.render('invacceptproduct',{error_msg:'Error cant find product with this brand in sender inventory',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});

})

}
else{
    res.render('invacceptproduct',{error_msg:'Error while finding product request order already updated',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});

}
}).catch(err =>{
    res.render('invacceptproduct',{error_msg:'Error while finding product request order',acceptedproductqueue:acceptedproductqueue,shoplist:shoplist,warelist:warelist,user:req.user,acceptedproductrequest:acceptedproductrequest});

})


});
router.post('/transferproduct/(:prid)', ensureAuthenticated, async (req, res) =>{
    
    
    const acceptedtransferproductrequest = await db.ProductRequest.findAll({where:{sentfrom:req.user.wareid,status:'Accepted'}})
    const warelist = await db.Warehouse.findAll({})
    const shoplist = await db.Shop.findAll({})
    db.ProductRequest.findOne({where:{prid:req.params.prid}}).then(apr =>{
     
        if(apr){
           const productid = apr.productid;
           const brandid = apr.brandid;
           const requestby = apr.requsetby;
           const sentamount = parseFloat(apr.sentamount);
           db.Inventory.findOne({where:{productid:productid,brandid:brandid,warehouseid:req.user.wareid}}).then(pif =>{
            console.log(pif)
            if(pif){
                console.log("2")
                console.log(pif)
                const invamt = parseFloat(pif.totamount);
              if(invamt >sentamount){
                db.ProductRequest.update({status:'AcceptedAndSent',transfercontroller:'Queue',transferdate:new Date()},{where:{prid:req.params.prid}}).then(pras =>{
                     db.ProductRequest.findAll({where:{sentfrom:req.user.wareid,status:'Accepted'}}).then(naprl =>{
                        res.render('invtransferproduct',{success_msg:'Successfully create transfer controller and sent product request order',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:naprl});
                 
                    }).catch(err =>{
                        res.render('invtransferproduct',{error_msg:'Cant find update product transfer order list. please refresh and try again',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});
                  
                    })
                }).catch(err =>{
                    res.render('invtransferproduct',{error_msg:'Cant transfer now. please try again',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});
              
                })
              }else{

                res.render('invtransferproduct',{error_msg:'Cant have enough amount product with this brand in your inventory',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});
               }
              

             }else{
                res.render('invtransferproduct',{error_msg:'Cant find product with this brand in your inventory',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});
    
             }

           }).catch(err =>{
            console.log(err)
            res.render('invtransferproduct',{error_msg:'Cant find product with this brand in your inventory',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});
    
           })
        }else{
            res.render('invtransferproduct',{error_msg:'Cant find product request by this ID',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});
    
        }
    }).catch(err =>{
        res.render('invtransferproduct',{error_msg:'Cant find product request by this ID',shoplist:shoplist,warelist:warelist,user:req.user,acceptedtransferproductrequest:acceptedtransferproductrequest});
    
    })
   

});
module.exports = router;