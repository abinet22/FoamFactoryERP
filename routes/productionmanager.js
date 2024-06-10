const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/addnewwfoamblockproduction', ensureAuthenticated, async (req, res) =>{
const rowmateriallist = await db.RowMaterial.findAll({})
const blockprolist = await db.BlockProduction.findAll({})
const warehouselist = await db.Warehouse.findAll({where:{ismain:'Ýes',waretype:'Final_Product'}});
res.render('addnewwfoamblockproduction',{warehouselist:warehouselist,user:req.user,rowmateriallist:rowmateriallist,blockprolist:blockprolist});
});
router.get('/addnewwfoammatressproduction', ensureAuthenticated, async (req, res) =>{
    const rowmateriallist = await db.RowMaterial.findAll({})
    const blockprolist = await db.BlockProduction.findAll({where:{isfinished:'No'}})
    const warehouselist = await db.Warehouse.findAll({where:{ismain:'Ýes',waretype:'Final_Product'}});
    const productlist = await db.Product.findAll({})
    const wiplist = await db.WIP.findAll({});
    const brandlist = await db.Brand.findAll({});
    const finallist = await db.FinalProduct.findAll({});
    res.render('addnewwfoammatressproduction',{finallist:finallist,brandlist:brandlist,wiplist:wiplist,productlist:productlist,warehouselist:warehouselist,user:req.user,rowmateriallist:rowmateriallist,blockprolist:blockprolist});
    });
    

router.post('/addnewwfoamblockproduction', ensureAuthenticated, async function (req, res) {
    const { rowmaterialamountobjarray, totalcost, blockno, warehouse ,batchname} = req.body;
    const rowmateriallist = await db.RowMaterial.findAll({});
    const blockprolist = await db.BlockProduction.findAll({});
    const blocklist = await db.BlockProduction.findOne({where:{batchname:batchname}});
    const warehouselist = await db.Warehouse.findAll({where:{ismain:'Ýes',waretype:'Final_Product'}});
   let errors =[]
    if (!rowmaterialamountobjarray || !batchname || !warehouse || !totalcost || !blockno) {
       errors.push({msg:'Please enter all required fields'})
    } 
    if (warehouse ==="0") {
        errors.push({msg:'Please select warehouse name'})
    } 
    if (blocklist) {
        errors.push({msg:'This batch already registered'})
    } 
    if(errors.length >0){
        res.render('addnewwfoamblockproduction', {
            errors,
            user: req.user,warehouselist:warehouselist,
            rowmateriallist: rowmateriallist,
            blockprolist: blockprolist
        });
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
                const existingRowMaterial = await db.RowMaterial.findOne({
                    where: { warehouseid: warehouse, rowmaterialid: item.rowMaterialId },
                    transaction: transaction
                });
                // Update the row material amount in the database
                if (existingRowMaterial) {
                    // Calculate the new totamount by subtracting item.amount
                    const newTotAmount = parseFloat(existingRowMaterial.totamount) - parseFloat(item.amount);

                    // Update the row material totamount in the database
                    if (newTotAmount >= 0) {
                        // Update the row material totamount in the database
                        await db.RowMaterial.update(
                            { totamount: newTotAmount },
                            { where: { warehouseid: warehouse, rowmaterialid: item.rowMaterialId }, transaction: transaction }
                        );
                    } else {
                        res.render('addnewwfoamblockproduction', {
                            warehouselist: warehouselist,
                            error_msg: 'Error row material with name'+" "+ item.rowMaterialName +" "+'found total amount not sufficient. you need'+" "+ newTotAmount,
                            user: req.user,
                            rowmateriallist: rowmateriallist,
                            blockprolist: blockprolist
                        });
                        // Handle the case where newTotAmount would go negative (e.g., display an error message)
                       // console.error(`Updating rowMaterialId ${item.rowMaterialId} would result in a negative totamount.`);
                        // Optionally, you can choose to rollback the transaction here.
                        // await transaction.rollback();
                    }
                }
            }
           
            // Create the block production record
            const bp = {
                blockid: uuidv4(),
                materialusedlist: rowmaterialamountobjarray,
                estitotalcost: totalcost,
                estitotalblock: blockno,
                werehouse: warehouse,
                status:'Ok',
                batchname:batchname,
                isfinished:'No'
            };

            // Create the block production record within the transaction
            const bpl = await db.BlockProduction.create(bp, { transaction: transaction });

            // Commit the transaction
            await transaction.commit();

            if (bpl) {
                db.BlockProduction.findAll({}).then((nbp) => {
                    res.render('addnewwfoamblockproduction', {
                        warehouselist: warehouselist,
                        success_msg: 'Successfully create new foam block production info',
                        user: req.user,
                        rowmateriallist: rowmateriallist,
                        blockprolist: nbp
                    });
                }).catch((err) => {
                    res.render('addnewwfoamblockproduction', {
                        warehouselist: warehouselist,
                        error_msg: 'Error while finding new block production list info',
                        user: req.user,
                        rowmateriallist: rowmateriallist,
                        blockprolist: blockprolist
                    });
                });
            } else {
                res.render('addnewwfoamblockproduction', {
                    warehouselist: warehouselist,
                    error_msg: 'Error cant create now try again',
                    user: req.user,
                    rowmateriallist: rowmateriallist,
                    blockprolist: blockprolist
                });
            }
        } catch (error) {
            // Handle any errors that occurred during the transaction
            if (transaction) {
                await transaction.rollback(); // Rollback the transaction if an error occurs
            }
            res.render('addnewwfoamblockproduction', {
                warehouselist: warehouselist,
                error_msg: 'Error while creating foam block production info',
                user: req.user,
                rowmateriallist: rowmateriallist,
                blockprolist: blockprolist
            });
        }
    }
});
router.post('/addnewwipmattressproduction', ensureAuthenticated, async function (req, res) {
    const { rowmaterialamountobjarray ,blockid} = req.body;
    const rowmateriallist = await db.RowMaterial.findAll({});
    const blockprolist = await db.BlockProduction.findAll({where:{isfinished:'No'}})
    const productlist = await db.Product.findAll({})
    const warehouselist = await db.Warehouse.findAll({where:{ismain:'Ýes',waretype:'Final_Product'}});
    const wiplist = await db.WIP.findAll({});
    const brandlist = await db.Brand.findAll({});
    const finallist = await db.FinalProduct.findAll({});
   let errors =[]
    if (!rowmaterialamountobjarray || !blockid ) {
       errors.push({msg:'Please enter all required fields'})
    } 
  
  
    if(errors.length >0){
        res.render('addnewwfoammatressproduction', {
            errors,productlist:productlist,
            user: req.user,warehouselist:warehouselist,
            rowmateriallist: rowmateriallist, 
            finallist:finallist,brandlist:brandlist,
            blockprolist: blockprolist,wiplist:wiplist,
        });
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
                    const newTotAmount = parseFloat(existingRowMaterial.totalwip) + parseFloat(item.amount);

                    // Update the row material totamount in the database
                    await db.WIP.update(
                        { totalwip: newTotAmount },
                        { where: {productid: item.productId }, transaction: transaction }
                    );
                }else{
                    const wipdata ={
                        wipid:uuidv4(),
                        productid:item.productId,
                        productname:item.productName,
                        processby:req.user.userid,
                        wipprogress:'WIP',
                        totalwip:parseFloat(item.amount)
                    }
                    await db.WIP.create(wipdata);
                }
            }
           
            // Create the block production record
            const bp = {
                blockid: blockid,
                productlist: rowmaterialamountobjarray,
                wipaddby:req.user.userid
            };

            // Create the block production record within the transaction
              
            const bpl = await db.BlockProductionLog.create(bp, { transaction: transaction });

            // Commit the transaction
            await transaction.commit();

            if (bpl) {
                db.WIP.findAll({}).then((nbp) => {
                    res.render('addnewwfoammatressproduction', {
                        warehouselist: warehouselist,
                        success_msg: 'Successfully create new matress production WIP info',
                        user: req.user,wiplist:nbp,productlist:productlist,
                        rowmateriallist: rowmateriallist,
                        blockprolist: blockprolist,
                        finallist:finallist,brandlist:brandlist,
                    });
                }).catch((err) => {
                    res.render('addnewwfoammatressproduction', {
                        warehouselist: warehouselist,
                        error_msg: 'Error while finding new matress production WIP info',
                        user: req.user,productlist:productlist,
                        rowmateriallist: rowmateriallist,
                        finallist:finallist,brandlist:brandlist,
                        blockprolist: blockprolist,wiplist:wiplist,
                    });
                });
            } else {
                res.render('addnewwfoammatressproduction', {
                    warehouselist: warehouselist,
                    error_msg: 'Error cant create now try again',
                    user: req.user,productlist:productlist,
                    finallist:finallist,brandlist:brandlist,
                    rowmateriallist: rowmateriallist,wiplist:wiplist,
                    blockprolist: blockprolist
                });
            }
        } catch (error) {
            console.log(error)
            // Handle any errors that occurred during the transaction
            if (transaction) {
                await transaction.rollback(); // Rollback the transaction if an error occurs
            }
            res.render('addnewwfoammatressproduction', {
                warehouselist: warehouselist,
                error_msg: 'Error while creating foam matress production WIP info',
                user: req.user,productlist:productlist,
                rowmateriallist: rowmateriallist,wiplist:wiplist,
                blockprolist: blockprolist,
                finallist:finallist,brandlist:brandlist,
            });
        }
    }
});

router.post('/addnewfinalmattressproduction', ensureAuthenticated, async function (req, res) {
    const { frowmaterialamountobjarray ,warehouse} = req.body;
    const rowmateriallist = await db.RowMaterial.findAll({})
    const blockprolist = await db.BlockProduction.findAll({where:{isfinished:'No'}})
    const warehouselist = await db.Warehouse.findAll({where:{ismain:'Ýes',waretype:'Final_Product'}});
    const productlist = await db.Product.findAll({})
    const wiplist = await db.WIP.findAll({});
    const brandlist = await db.Brand.findAll({});
    const finallist = await db.FinalProduct.findAll({});
   let errors =[]
    if (!frowmaterialamountobjarray || !warehouse || warehouse ==="0" ) {
       errors.push({msg:'Please enter all required fields'})
    } 
  
  
    if(errors.length >0){
        res.render('addnewwfoammatressproduction', {
            errors,productlist:productlist,
          
            user: req.user,warehouselist:warehouselist,
            rowmateriallist: rowmateriallist, 
            finallist:finallist,brandlist:brandlist,
            blockprolist: blockprolist,wiplist:wiplist,
        });
    }
    else {
        let transaction; // Define a transaction variable

        try {
            // Start the transaction
            transaction = await db.sequelize.transaction();
            const rmusedlist =JSON.parse(frowmaterialamountobjarray)
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
                                    res.render('addnewwfoammatressproduction', {
                                        warehouselist: warehouselist,
                                        error_msg: 'Error rowmaterial fabric with name'+" "+ rmfabric.rowmaterialname +" "+'found total amount not sufficient. you need'+" "+ newfab,
                                        user: req.user,productlist:productlist,
                                        rowmateriallist: rowmateriallist,
                                        finallist:finallist,brandlist:brandlist,
                                        blockprolist: blockprolist,wiplist:wiplist,
                                    });
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
                        res.render('addnewwfoammatressproduction', {
                            warehouselist: warehouselist,
                            error_msg: 'Error product with name'+" "+ item.productName +" "+'found total amount not sufficient. you need'+" "+ newTotAmount,
                            user: req.user,productlist:productlist,
                            rowmateriallist: rowmateriallist,
                            finallist:finallist,brandlist:brandlist,
                            blockprolist: blockprolist,wiplist:wiplist,
                        });
                      
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
                    res.render('addnewwfoammatressproduction', {
                        warehouselist: warehouselist,
                        success_msg: 'Successfully create new matress final production info',
                        user: req.user,wiplist:nbp,productlist:productlist,
                        rowmateriallist: rowmateriallist,
                        blockprolist: blockprolist,
                        wiplist:nbp,
                       
                        finallist:bpl,brandlist:brandlist,
                    });
                }).catch((err) => {
                    res.render('addnewwfoammatressproduction', {
                        warehouselist: warehouselist,
                        error_msg: 'Error while finding matress production WIP info',
                        user: req.user,productlist:productlist,
                        rowmateriallist: rowmateriallist,
                       
                        finallist:bpl,brandlist:brandlist,
                        blockprolist: blockprolist,wiplist:wiplist,
                    });
                });
            } else {
                res.render('addnewwfoammatressproduction', {
                    warehouselist: warehouselist,
                    error_msg: 'Error cant create now try again',
                    user: req.user,productlist:productlist,
                   
                    brandlist:brandlist,
                    finallist:finallist,
                    rowmateriallist: rowmateriallist,wiplist:wiplist,
                    blockprolist: blockprolist
                });
            }
        } catch (error) {
            console.log(error)
            // Handle any errors that occurred during the transaction
            if (transaction) {
                await transaction.rollback(); // Rollback the transaction if an error occurs
            }
            res.render('addnewwfoammatressproduction', {
                warehouselist: warehouselist,
                error_msg: 'Error while creating foam matress final production  info',
                user: req.user,productlist:productlist,
                rowmateriallist: rowmateriallist,wiplist:wiplist,
               
                blockprolist: blockprolist,
                finallist:finallist,brandlist:brandlist,
            });
        }
    }
});
router.post('/deleteandupdateamount/(:blockid)', ensureAuthenticated, async function (req, res) {
    const blockId = req.params.blockid;
    const rowmateriallist = await db.RowMaterial.findAll({});
    const blockprolist = await db.BlockProduction.findAll({});
    const warehouselist = await db.Warehouse.findAll({});

    try {
        // Find the BlockProduction record by blockid
        const blockProduction = await db.BlockProduction.findOne({ where: { blockid: blockId } });

        if (blockProduction) {
            // Start a transaction
            const transaction = await db.sequelize.transaction();

            try {
                const materialUsedList = JSON.parse(blockProduction.materialusedlist);
              //  console.log(materialUsedList)
                // Iterate through the row material amount objects
                for (const item of materialUsedList) {
                    //console.log(item.rowMaterialName)

                    const existingRowMaterial = await db.RowMaterial.findOne({
                        where: { warehouseid: blockProduction.werehouse, rowmaterialid: item.rowMaterialId },
                        transaction: transaction
                    });

                    // Update the row material amount in the database
                    if (existingRowMaterial) {
                        // Calculate the new totamount by adding item.amount
                        const newTotAmount = parseFloat(existingRowMaterial.totamount) + parseFloat(item.amount);
                       // console.log(item.rowMaterialId)
                        // Update the row material totamount in the database
                        await db.RowMaterial.update(
                            { totamount: newTotAmount },
                            {
                                where: {
                                    warehouseid: blockProduction.werehouse,
                                    rowmaterialid: item.rowMaterialId
                                },
                                transaction: transaction
                            }
                        );
                    }
                }
               

// Now destroy the BlockProduction record
              //  await db.BlockProduction.destroy({ where: { blockid: blockId }, transaction: transaction });
               // await transaction.commit();
                // Destroy the BlockProduction record
                await db.BlockProduction.update({ status: 'Deleted'},{ where: { blockid: blockId }, transaction: transaction });

                // Commit the transaction
                await transaction.commit();

                res.render('addnewwfoamblockproduction', {
                    warehouselist: warehouselist,
                    success_msg: 'Successfully updated foam block production info and row material amount in the warehouse',
                    user: req.user,
                    rowmateriallist: rowmateriallist,
                    blockprolist: blockprolist
                });
            } catch (error) {
                console.error(error);
                await transaction.rollback(); // Rollback the transaction if an error occurs
                res.render('addnewwfoamblockproduction', {
                    warehouselist: warehouselist,
                    error_msg: 'Error while processing the transaction',
                    user: req.user,
                    rowmateriallist: rowmateriallist,
                    blockprolist: blockprolist
                });
            }
        } else {
            res.render('addnewwfoamblockproduction', {
                warehouselist: warehouselist,
                error_msg: 'Error: Cannot find this production data, please check the production id',
                user: req.user,
                rowmateriallist: rowmateriallist,
                blockprolist: blockprolist
            });
        }
    } catch (error) {
        console.error(error);
        res.render('addnewwfoamblockproduction', {
            warehouselist: warehouselist,
            error_msg: 'Error while updating foam block production info',
            user: req.user,
            rowmateriallist: rowmateriallist,
            blockprolist: blockprolist
        });
    }
});

router.get('/blockproductionlog',ensureAuthenticated,async function(req,res){
    const blockprolog = await db.BlockProductionLog.findAll({});
    res.render('problocklog',{blockprolog:blockprolog,user:req.user})
})
router.get('/mattressproductionlog',ensureAuthenticated,async function(req,res){
    const [mattressprolog,ml] = await db.sequelize.query(`
    select * from ProductionLogs 
    inner join Products on Products.productid = ProductionLogs.productid
    inner join Brands on ProductionLogs.brandid = Brands.brandid
    inner join Warehouses on Warehouses.warehouseid =ProductionLogs.sentwarehouseid
    where producttype='Mattress'
    `)
   
    res.render('promatresslog',{mattressprolog:mattressprolog,user:req.user})
});
router.get('/pillowproductionlog',ensureAuthenticated,async function(req,res){

    const [pillowprolog,ml] = await db.sequelize.query(`
    select * from ProductionLogs 
    inner join Products on Products.productid = ProductionLogs.productid
    inner join Brands on ProductionLogs.brandid = Brands.brandid
    inner join Warehouses on Warehouses.warehouseid =ProductionLogs.sentwarehouseid
    where producttype='Pillow'
    `)
    res.render('propillowlog',{pillowprolog:pillowprolog,user:req.user})
});
router.get('/comfortproductionlog',ensureAuthenticated,async function(req,res){
    
    const [comfortprolog,ml] = await db.sequelize.query(`
    select * from ProductionLogs 
    inner join Products on Products.productid = ProductionLogs.productid
    inner join Brands on ProductionLogs.brandid = Brands.brandid
    inner join Warehouses on Warehouses.warehouseid =ProductionLogs.sentwarehouseid
    where producttype='Comfort'
    `)
    res.render('procomfortlog',{comfortprolog:comfortprolog,user:req.user})
})
router.get('/addnewwfoampilloproduction',ensureAuthenticated,async function(req,res){
  const  brandlist =  await db.Brand.findAll({})
  const  productlist = await db.Product.findAll({})
    const [pillowprolist,ml] = await db.sequelize.query(`
    select * from ProductionLogs 
    inner join Products on Products.productid = ProductionLogs.productid
    inner join Brands on ProductionLogs.brandid = Brands.brandid
    inner join Warehouses on Warehouses.warehouseid =ProductionLogs.sentwarehouseid
    where producttype='Comfort'
    `)
    res.render('addnewwfoampilloproduction',{brandlist:brandlist,productlist:productlist,pillowprolist:pillowprolist,user:req.user})
})
router.get('/addnewwfoamcomfortproduction',ensureAuthenticated,async function(req,res){
    const  brandlist =  await db.Brand.findAll({})
    const  productlist = await db.Product.findAll({})
    const [comfortprolist,ml] = await db.sequelize.query(`
    select * from ProductionLogs 
    inner join Products on Products.productid = ProductionLogs.productid
    inner join Brands on ProductionLogs.brandid = Brands.brandid
    inner join Warehouses on Warehouses.warehouseid =ProductionLogs.sentwarehouseid
    where producttype='Comfort'
    `)
    res.render('addnewwfoamcomfortproduction',{brandlist:brandlist,productlist:productlist,comfortprolist:comfortprolist,user:req.user})
})
module.exports = router;