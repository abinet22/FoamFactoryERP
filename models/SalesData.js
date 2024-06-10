module.exports = (sequelize, DataTypes) => {

    const SalesData = sequelize.define("SalesData", {
      saleid: {
        type: DataTypes.STRING,
     
      },
  soldby: {
    type: DataTypes.STRING,
 
  },
  productid: {
    type: DataTypes.STRING,
 
  },
  brandid: {
    type: DataTypes.STRING,
 
  },
  unitprice: {
    type: DataTypes.DECIMAL(10,3),
 
  },
  quantity: {
    type: DataTypes.DECIMAL(10,3),
 
  },
  totalprice: {
    type: DataTypes.DECIMAL(10,3),
 
  },
  transactiontype: {
    type: DataTypes.STRING
 
  },
  shopid: {
    type: DataTypes.STRING
 
  },
  salesperson: {
    type: DataTypes.STRING
 
  },
  customername: {
    type: DataTypes.STRING
 
  },
  customerphone: {
    type: DataTypes.STRING
 
  },
  ifbank: {
    type: DataTypes.STRING
 
  },

  
})
    return SalesData;
};


