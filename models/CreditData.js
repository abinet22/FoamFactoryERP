module.exports = (sequelize, DataTypes) => {

    const CreditData = sequelize.define("CreditData", {
      saleid: {
        type: DataTypes.STRING,
     
      },
  soldby: {
    type: DataTypes.STRING,
 
  },

  paidamount: {
    type: DataTypes.DECIMAL(10,3),
 
  },
  creditamount: {
    type: DataTypes.DECIMAL(10,3),
 
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


  
})
    return CreditData;
};


