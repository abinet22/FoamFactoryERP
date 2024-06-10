
module.exports = (sequelize, DataTypes) => {

    const ProductionLog = sequelize.define("ProductionLog", {
      plid: {
        type: DataTypes.STRING,
     
      },
      productid: {
    type: DataTypes.STRING,
 
  },

  brandid: {
    type: DataTypes.STRING,
  
   },
   
  producttype: {
    type: DataTypes.STRING,
  
   },
   totalproduction: {
    type: DataTypes.DECIMAL,
  
   },
   sentwarehouseid: {
    type: DataTypes.STRING,
  
   },
})
    return ProductionLog;
};


