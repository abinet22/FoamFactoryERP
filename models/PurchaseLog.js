
  module.exports = (sequelize, DataTypes) => {

    const PurchaseLog = sequelize.define("PurchaseLog", {
        rowmaterialtype : {
            type: DataTypes.STRING,
         
          },
          rowmaterialid : {
            type: DataTypes.STRING,
         
          },
          rowmaterialname : {
            type: DataTypes.STRING,
         
          },
        purchasedate : {
            type: DataTypes.DATE,
         
          },
          purchasetype : {
            type: DataTypes.STRING,
         
          },
          purchaseprice : {
            type: DataTypes.DECIMAL,
         
          },
          ifdebtfrom : {
            type: DataTypes.STRING,
         
          },
          creditamount : {
            type: DataTypes.DECIMAL,
         
          },

  
})
    return PurchaseLog;
};


