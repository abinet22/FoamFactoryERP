const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createproduct', ensureAuthenticated, async (req, res) =>{
const productlist = await db.Product.findAll({})

res.render('createproducts',{user:req.user,productlist:productlist});
});
router.get('/createbrand', ensureAuthenticated, async (req, res) =>{
    const brandlist = await db.Brand.findAll({})
    
    res.render('createbrand',{user:req.user,brandlist:brandlist});
    });
    router.get('/createbankaccount', ensureAuthenticated, async (req, res) =>{
        const bankaccountlist = await db.BankAccount.findAll({})
        
        res.render('createbankaccount',{user:req.user,bankaccountlist:bankaccountlist});
        });
router.get('/createempposition', ensureAuthenticated, async (req, res) =>{
const positionlist = await db.Position.findAll({})

res.render('createempposition',{user:req.user,positionlist:positionlist});
});
router.get('/createnewshop', ensureAuthenticated, async (req, res) =>{
const shoplist = await db.Shop.findAll({})

res.render('createnewshop',{user:req.user,shoplist:shoplist});
});
router.get('/createnewwarehouse', ensureAuthenticated, async (req, res) =>{
const warelist = await db.Warehouse.findAll({})

res.render('createnewwarehouse',{user:req.user,warelist:warelist});
});
router.get('/setproductprice', ensureAuthenticated, async (req, res) =>{
const productlist = await db.Product.findAll({});
const shoplist = await db.Shop.findAll({});
const brandlist = await db.Brand.findAll({});
const [productprice,ppm] = await db.sequelize.query(`
select * from Prices inner join Products on Products.productid = Prices.productid
inner join Shops on Prices.shopid = Shops.shopid
inner join Brands on Prices.brandid = Brands.brandid
`)
res.render('setproductprice',{brandlist:brandlist,user:req.user,productlist:productlist,productprice:productprice,shoplist:shoplist});

});   

router.get('/creatematerial', ensureAuthenticated, async (req, res) =>{
    const rmlist = await db.MaterialName.findAll({})
    const brandlist =await db.Brand.findAll({})
    res.render('creatematerial',{user:req.user,rmlist:rmlist,brandlist:brandlist});
    });
router.post('/addnewmaterial',ensureAuthenticated,async function(req,res){
const {rmname,rmtype,fabricbrand} = req.body;
const brandlist =await db.Brand.findAll({})
let errors =[];
const rmlist = await db.MaterialName.findAll({})
if(!rmname ||!rmtype){
    errors.push({msg:'Please enter all required feilds'})
}
if(rmtype ==="0"){
errors.push({msg:'Please select material type'})
}
if(errors.length >0 ){
    res.render('creatematerial',{brandlist:brandlist,errors,user:req.user,rmlist:rmlist});
      
}else{
    const matData ={
        rmid:uuidv4(),
        rmname:rmname,
        rmtype:rmtype,
        fbrand:fabricbrand
    }
    db.MaterialName.findOne({where:{rmname:rmname}}).then(mat =>{
        if(mat){
            res.render('creatematerial',{error_msg:'Error material name already registered',brandlist:brandlist,user:req.user,rmlist:rmlist});
        }else{
     db.MaterialName.create(matData).then(mat =>{
        db.MaterialName.findAll({}).then(newmatlist =>{
            res.render('creatematerial',{success_msg:'Successfully material registered',brandlist:brandlist,user:req.user,rmlist:newmatlist});
 
        }).catch(err =>{
            res.render('creatematerial',{error_msg:'Error while finding new material data',brandlist:brandlist,user:req.user,rmlist:rmlist});
 
        })
     }).catch(er =>{
        console.log(err)
        res.render('creatematerial',{error_msg:'Error while creating new material info',brandlist:brandlist,user:req.user,rmlist:rmlist});
     
    })
        }
    }).catch(er =>{
        console.log(err)
        res.render('creatematerial',{error_msg:'Error material name already registered',brandlist:brandlist,user:req.user,rmlist:rmlist});
     
    })
}
})
router.post('/addnewproduct',ensureAuthenticated,async function(req,res){
    const {productcode,productname,plasticneed,fibericneed} = req.body;
    const productlist = await db.Product.findAll({})
    
    if(!productname ||!productcode ||!fibericneed ||!plasticneed){
        res.render('createproducts',{error_msg:'Please add all required fields',user:req.user,productlist:productlist});
    }else{
        const catData ={
            productid: uuidv4(),
            productcode:productcode,        
          productname:productname,
          plasticneed:plasticneed,
          fibericneed:fibericneed

        }
        db.Product.findOne({where:{productname:productname}}).then(pro =>{
            if(pro){
                res.render('createproducts',{error_msg:'Error product already registered',user:req.user,productlist:productlist});
     
            }else{
                db.Product.create(catData).then(prodt =>{
                    if(prodt){
                   db.Product.findAll({}).then(newpro =>{
                    res.render('createproducts',{success_msg:'Successfully create new product',user:req.user,productlist:newpro});
     
                   }).catch(err =>{
                    res.render('createproducts',{error_msg:'Error while finding updated product list',user:req.user,productlist:productlist});
     
                   })
                    }
                   }).catch(err =>{
                    res.render('createproducts',{error_msg:'Error while  creating new product',user:req.user,productlist:productlist});
     
                   })
            }
        }).catch(err =>{
            res.render('createproducts',{error_msg:'Error while existing new product',user:req.user,productlist:productlist});
         
        })
      
      }
});
router.post('/addnewshop',ensureAuthenticated,async function(req,res){
    const {shopname,shopaddress} = req.body;
    const shoplist = await db.Shop.findAll({})
    
    if(!shopaddress ||!shopname){
        res.render('createnewshop',{error_msg:'Please add all required fields',user:req.user,shoplist:shoplist});
    }else{
        const catData ={
            shopid: uuidv4(),
            shopaddress:shopaddress,        
            shopname:shopname,
            is_active:'Yes'
        }
        db.Shop.findOne({where:{shopname:shopname}}).then(pro =>{
            if(pro){
                res.render('createnewshop',{error_msg:'Error shop already registered',user:req.user,shoplist:shoplist});
     
            }else{
                db.Shop.create(catData).then(prodt =>{
                    if(prodt){
                   db.Shop.findAll({}).then(newpro =>{
                    res.render('createnewshop',{success_msg:'Successfully create new shop',user:req.user,shoplist:newpro});
     
                   }).catch(err =>{
                    res.render('createnewshop',{error_msg:'Error while finding updated shop list',user:req.user,shoplist:shoplist});
     
                   })
                    }
                   }).catch(err =>{
                    res.render('createnewshop',{error_msg:'Error while  creating new shop',user:req.user,shoplist:shoplist});
     
                   })
            }
        }).catch(err =>{
            res.render('createnewshop',{error_msg:'Error while existing new shop',user:req.user,shoplist:shoplist});
         
        })
      
      }
});
router.post('/addnewbrand',ensureAuthenticated, async function(req,res){
    const {brandname} = req.body;
    const brandlist = await db.Brand.findAll({})

    if(!brandname ){
      
    res.render('createbrand',{error_msg:'Please add all required fields',user:req.user,brandlist:brandlist});
    }else{
        const catData ={
            brandid: uuidv4(),
            brandname:brandname,        
           
            is_active:'Yes'
        }
        db.Brand.findOne({where:{brandname:brandname}}).then(pro =>{
            if(pro){
                res.render('createbrand',{error_msg:'Error brand already registered',user:req.user,brandlist:brandlist});
     
            }else{
                db.Brand.create(catData).then(prodt =>{
                    if(prodt){
                   db.Brand.findAll({}).then(newpro =>{
                    res.render('createbrand',{success_msg:'Successfully create new brand',user:req.user,brandlist:newpro});
     
                   }).catch(err =>{
                    res.render('createbrand',{error_msg:'Error while finding updated brand list',user:req.user,brandlist:brandlist});
     
                   })
                    }
                   }).catch(err =>{
                    res.render('createbrand',{error_msg:'Error while  creating new brand',user:req.user,brandlist:brandlist});
     
                   })
            }
        }).catch(err =>{
            console.log(err)
            res.render('createbrand',{error_msg:'Error while finding existing new brand',user:req.user,brandlist:brandlist});
         
        })
      
      }  
})
router.post('/addnewwarehouse',ensureAuthenticated,async function(req,res){
    const {warehousename,warehouseaddress,ismain,waretype} = req.body;
    const warelist = await db.Warehouse.findAll({})
       
    if(!warehouseaddress ||!warehousename ||!waretype){
        res.render('createnewwarehouse',{error_msg:'Please add all required fields',user:req.user,warelist:warelist});
        }else{
        const catData ={
            warehouseid: uuidv4(),
            warehouseaddress:warehouseaddress,        
            warehousename:warehousename,
            is_active:'Yes',
            waretype:waretype,
            ismain:ismain
        }
        db.Warehouse.findOne({where:{warehousename:warehousename}}).then(pro =>{
            if(pro){
                res.render('createnewwarehouse',{error_msg:'Error warehouse already registered',user:req.user,warelist:warelist});
     
            }else{
                db.Warehouse.create(catData).then(prodt =>{
                    if(prodt){
                   db.Warehouse.findAll({}).then(newpro =>{
                    res.render('createnewwarehouse',{success_msg:'Successfully create new warehouse',user:req.user,warelist:newpro});
     
                   }).catch(err =>{
                    res.render('createnewwarehouse',{error_msg:'Error while finding updated warehouse list',user:req.user,warelist:warelist});
     
                   })
                    }
                   }).catch(err =>{
                    res.render('createnewwarehouse',{error_msg:'Error while  creating new warehouse',user:req.user,warelist:warelist});
     
                   })
            }
        }).catch(err =>{
            res.render('createnewwarehouse',{error_msg:'Error while existing new warehouse',user:req.user,warelist:warelist});
         
        })
      
      }
});
router.post('/addnewbankaccount',ensureAuthenticated, async function(req,res){
    const {bankname,accountno} = req.body;
    const bankaccountlist = await db.BankAccount.findAll({})
        
    if(!bankname ||!accountno ){

        res.render('createbankaccount',{user:req.user,bankaccountlist:bankaccountlist});
   }else{
        const catData ={
            baid: uuidv4(),
            bankname:bankname,        
            accountno:accountno,        
            amount:0,
            is_active:'Yes'
        }
        db.BankAccount.findOne({where:{accountno:accountno}}).then(pro =>{
            if(pro){
             
        res.render('createbankaccount',{error_msg:'Account already registered',user:req.user,bankaccountlist:bankaccountlist});
            }else{
                db.BankAccount.create(catData).then(prodt =>{
                    if(prodt){
                   db.BankAccount.findAll({}).then(newbacc =>{
                    
                    res.render('createbankaccount',{success_msg:'Successfully add new bank  account',user:req.user,bankaccountlist:newbacc});
                   }).catch(err =>{
                  
                    res.render('createbankaccount',{error_msg:'Error while finding updated account list',user:req.user,bankaccountlist:bankaccountlist});
                   })
                    }
                   }).catch(err =>{
                   
                    res.render('createbankaccount',{error_msg:'Error while  creating new account',user:req.user,bankaccountlist:bankaccountlist});
               
                   })
            }
        }).catch(err =>{
            console.log(err)
            res.render('createbankaccount',{error_msg:'Error while finding existing new brand',user:req.user,bankaccountlist:bankaccountlist});
         
        })
      
      }  
})
router.post('/setproductprice',ensureAuthenticated,async function(req,res){
    const {price,shopid,productid,brandid} = req.body;
    const productlist = await db.Product.findAll({});
    const shoplist = await db.Shop.findAll({});
    const brandlist =await db.Brand.findAll({})
    
    const [productprice,ppm] = await db.sequelize.query(`
    select * from Prices inner join Products on Products.productid = Prices.productid
    inner join Shops on Prices.shopid = Shops.shopid
    `)
    let errors =[];
    if(shopid =="0"||productid =="0" ||brandid =="0"){
       errors.push({msg:'Please select add all required fields'})
      }
    if(!shopid ||!productid || !price ||!brandid){
        errors.push({msg:'Please select add all required fields'})
      }
      if(errors.length >0){
        res.render('setproductprice',{brandlist:brandlist,errors,user:req.user,productlist:productlist,productprice:productprice,shoplist:shoplist});
    
      }
      else{
        const catData ={
            priceid: uuidv4(),
            productid:productid,        
            proprice:parseFloat(price),
            brandid:brandid,
            shopid:shopid
        }
        db.Price.findOne({where:{shopid:shopid,productid:productid,brandid:brandid}}).then(pro =>{
            if(pro){
                db.Price.update({proprice:parseFloat(price)},{where:{shopid:shopid,brandid:brandid,productid:productid}}).then(prodt =>{
                    if(prodt){
                        db.sequelize.query(`
  SELECT * FROM Prices
  INNER JOIN Products ON Products.productid = Prices.productid
  INNER JOIN Shops ON Prices.shopid = Shops.shopid
`)
.then(([results, metadata]) => {
    console.log(results)
  const udtproductprice = results; // Assuming the result is an array of objects
  const ppm = metadata; // You can choose what you want to do with the metadata
  res.render('setproductprice',{brandlist:brandlist,success_msg:'Successfully update product price for the shop',user:req.user,productlist:productlist,productprice:udtproductprice,shoplist:shoplist});
    
})
.catch(error => {
    res.render('setproductprice',{brandlist:brandlist,success_msg:'Successfully update product price for the shop',user:req.user,productlist:productlist,productprice:productprice,shoplist:shoplist});
 
});
                   
                    }
                   }).catch(err =>{
                    console.log(err)

                    res.render('setproductprice',{brandlist:brandlist,error_msg:'Error while updating price to this shop',user:req.user,productlist:productlist,productprice:productprice,shoplist:shoplist});
    
                   })
              
            }else{
                db.Price.create(catData).then(prodt =>{
                    if(prodt){
                         db.sequelize.query(`
                        SELECT * FROM Prices
                        INNER JOIN Products ON Products.productid = Prices.productid
                        INNER JOIN Shops ON Prices.shopid = Shops.shopid
                      `)
                      .then(([results, metadata]) => {
                        const newproductprice = results; // Assuming the result is an array of objects
                        const ppm = metadata; // You can choose what you want to do with the metadata
                        res.render('setproductprice',{brandlist:brandlist,success_msg:'Successfully set product price for the shop',user:req.user,productlist:productlist,productprice:newproductprice,shoplist:shoplist});
                     
                      })
                      .catch(err => {
                        console.log(err)
                          res.render('setproductprice',{brandlist:brandlist,success_msg:'Successfully set product price for the shop',user:req.user,productlist:productlist,productprice:productprice,shoplist:shoplist});
                       
                      });
                    }
                   }).catch(err =>{
                    console.log(err)
                    res.render('setproductprice',{brandlist:brandlist,error_msg:'Error while setting price to this shop',user:req.user,productlist:productlist,productprice:productprice,shoplist:shoplist});
    
                   })
            }
        }).catch(err =>{
            console.log(err)
            res.render('setproductprice',{brandlist:brandlist,error_msg:'Error while finding price data for this shop',user:req.user,productlist:productlist,productprice:productprice,shoplist:shoplist});
    
        })
      
      }
})
router.post('/addnewwarehouse',ensureAuthenticated,async function(req,res){
    const {warehousename,warehouseaddress} = req.body;
    const warelist = await db.Warehouse.findAll({})
       
    if(!warehouseaddress ||!warehousename){
        res.render('createnewwarehouse',{error_msg:'Please add all required fields',user:req.user,warelist:warelist});
        }else{
        const catData ={
            wareid: uuidv4(),
            warehouseaddress:warehouseaddress,        
            warehousename:warehousename,
            is_active:'Yes'
        }
        db.Warehouse.findOne({where:{warehousename:warehousename}}).then(pro =>{
            if(pro){
                res.render('createnewwarehouse',{error_msg:'Error warehouse already registered',user:req.user,warelist:warelist});
     
            }else{
                db.Warehouse.create(catData).then(prodt =>{
                    if(prodt){
                   db.Warehouse.findAll({}).then(newpro =>{
                    res.render('createnewwarehouse',{success_msg:'Successfully create new warehouse',user:req.user,warelist:newpro});
     
                   }).catch(err =>{
                    res.render('createnewwarehouse',{error_msg:'Error while finding updated warehouse list',user:req.user,warelist:warelist});
     
                   })
                    }
                   }).catch(err =>{
                    res.render('createnewwarehouse',{error_msg:'Error while  creating new warehouse',user:req.user,warelist:warelist});
     
                   })
            }
        }).catch(err =>{
            res.render('createnewwarehouse',{error_msg:'Error while existing new warehouse',user:req.user,warelist:warelist});
         
        })
      
      }
});
router.post('/addnewempposition',ensureAuthenticated, async function(req,res){
    const {positionname} = req.body;
    const positionlist = await db.Position.findAll({})

    if(!positionname ){
      
    res.render('createempposition',{error_msg:'Please add all required fields',user:req.user,positionlist:positionlist});
    }else{
        const catData ={
            positionid: uuidv4(),
            positionname:positionname,        
           
            is_active:'Yes'
        }
        db.Position.findOne({where:{positionname:positionname}}).then(pro =>{
            if(pro){
                res.render('createempposition',{error_msg:'Error position already registered',user:req.user,positionlist:positionlist});
     
            }else{
                db.Position.create(catData).then(prodt =>{
                    if(prodt){
                   db.Position.findAll({}).then(newpro =>{
                    res.render('createempposition',{success_msg:'Successfully create new position',user:req.user,positionlist:newpro});
     
                   }).catch(err =>{
                    res.render('createempposition',{error_msg:'Error while finding updated position list',user:req.user,positionlist:positionlist});
     
                   })
                    }
                   }).catch(err =>{
                    res.render('createempposition',{error_msg:'Error while  creating new position',user:req.user,positionlist:positionlist});
     
                   })
            }
        }).catch(err =>{
            res.render('createempposition',{error_msg:'Error while existing new position',user:req.user,positionlist:positionlist});
         
        })
      
      }  
})
module.exports = router;