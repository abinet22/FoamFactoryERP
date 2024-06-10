const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/addnewsale', ensureAuthenticated, async (req, res) =>{
const productlist = await db.Product.findAll({});
const brandlist = await db.Brand.findAll({});
const todaysaledata = await db.Brand.findAll({});
const pricelist = await db.Price.findAll({});
const employeelist = await db.Employee.findAll({});
const bankaccount = await db.BankAccount.findAll({});

res.render('shopaddnewsale',{bankaccount:bankaccount,employeelist:employeelist,pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

});
router.post('/addnewsales', ensureAuthenticated, async function (req, res) {
    const { rowmaterialamountobjarray ,bankaccount,paidamount,transactiontype,salesperson,customername,customerphone} = req.body;
   
    const productlist = await db.Product.findAll({});
    const brandlist = await db.Brand.findAll({});
    const todaysaledata = await db.Brand.findAll({});
    const pricelist = await db.Price.findAll({});
   let errors =[]
    if (!rowmaterialamountobjarray ||!paidamount || !transactiontype||!customername|| !salesperson || customerphone ==="0" ) {
       errors.push({msg:'Please enter all required fields'})
    } 
  
  
    if(errors.length >0){
      
res.render('shopaddnewsale',{errors,pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

    }
    else {
        let transaction; // Define a transaction variable

        try {
            // Start the transaction
            transaction = await db.sequelize.transaction();
            const rmusedlist =JSON.parse(rowmaterialamountobjarray)
            console.log(rmusedlist)
            // Iterate through the row material amount objects
            for (const item of rmusedlist) {
                const existingRowMaterial = await db.WIP.findOne({
                    where: { productid: item.productId },
                    transaction: transaction
                });
                // Update the row material amount in the database
                if (existingRowMaterial) {
                    // Calculate the new totamount by subtracting item.amount
                    const newTotAmount = parseFloat(existingRowMaterial.totalwip) - parseFloat(item.amount);

                    // Update the row material totamount in the database
                    if (newTotAmount >= 0) {
                        // Update the row material totamount in the database
                        await db.WIP.update(
                            { totalwip: newTotAmount },
                            { where: {productid: item.productId }, transaction: transaction }
                        );
                        const fp = {
                            fpid: uuidv4(),
                            productid: item.productId,
                            productname: item.productName,
                            processby: req.user.userid,
                            addedtowarehouse: warehouse,
                            brandid:item.brandId,
                            totalfinal:item.amount,
                            status:'FINAL'
                        };
                        const inv = {
                            invid: uuidv4(),
                            productid: item.productId,
                            productname: item.productName,
                            warehouseid: warehouse,
                            brandid:item.brandId,
                            brandname:item.brandName,
                            totamount:item.amount,
                            
                        };
                        const invlog ={
                            plid:uuidv4(),
                            productid:item.productId,
                            brandid:item.brandId,
                            producttype:'Mattress',
                            totalproduction: item.amount,
                            sentwarehouseid: warehouse,
                        }
                        const existinginventory = await db.Inventory.findOne({
                            where: { productid: item.productId,brandid:item.brandId, warehouseid: warehouse},
                            transaction: transaction
                        });
                        const retrmname = await db.MaterialName.findOne({
                            where: {fbrand:item.brandId},
                            transaction: transaction
                        });
                        if(retrmname){
                            const rmfabric = await db.RowMaterial.findOne({
                                where: {rowmaterialid:retrmname.rmid},
                                transaction: transaction
                            });
                            console.log(rmfabric)
                            if(rmfabric){
                                const newfab = parseFloat(rmfabric.totamount) - parseFloat(item.fabricNeed) * parseFloat(item.amount) ;
                                if(newfab >=0){
                                    await db.RowMaterial.update(
                                        { totamount: newfab },
                                        { where: {rowmaterialid:retrmname.rmid}, transaction: transaction }
                                    );
                                }else{
                                 
res.render('shopaddnewsale',{pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

                                }
                              
                            }
                        }
                        // Update the row material amount in the database
                        if (existinginventory) {
                            const newTotAmountInv = parseFloat(existinginventory.totamount) + parseFloat(item.amount);
                            await db.FinalProduct.create(fp, { transaction: transaction });
                            await db.Inventory.update(
                                { totamount: newTotAmountInv },
                                { where: {productid: item.productId,brandid:item.brandId, warehouseid: warehouse }, transaction: transaction }
                            );
                            await db.ProductionLog.create(invlog, { transaction: transaction });

                        }else{
                            await db.FinalProduct.create(fp, { transaction: transaction });
                            await db.Inventory.create(inv, { transaction: transaction });
                            await db.ProductionLog.create(invlog, { transaction: transaction });

                        }
                    } else {
                       
res.render('shopaddnewsale',{pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

                      
                    }
                }
            }
           
            // Create the block production record
           

            // Create the block production record within the transaction
              
            const bpl = await db.FinalProduct.findAll({ transaction: transaction });

            // Commit the transaction
            await transaction.commit();

            if (bpl) {
                db.WIP.findAll({}).then((nbp) => {
                  
res.render('shopaddnewsale',{pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

                }).catch((err) => {
                  
res.render('shopaddnewsale',{pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

                });
            } else {
              
res.render('shopaddnewsale',{pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

            }
        } catch (error) {
            console.log(error)
            // Handle any errors that occurred during the transaction
            if (transaction) {
                await transaction.rollback(); // Rollback the transaction if an error occurs
            }
      
res.render('shopaddnewsale',{pricelist:pricelist,todaysaledata:todaysaledata,brandlist:brandlist,user:req.user,productlist:productlist});

        }
    }
});




module.exports = router;