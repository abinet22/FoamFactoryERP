
module.exports = (sequelize, DataTypes) => {

    const ProductRequest = sequelize.define("ProductRequest", {
        prid: {
            type: DataTypes.STRING,
         
          },
      productid: {
        type: DataTypes.STRING,
     
      },
  productname: {
    type: DataTypes.STRING,
 
  },
  productcode: {
    type: DataTypes.STRING,
 
  },

  requsetby : {
    type: DataTypes.STRING,
 
  },
  brandid: {
    type: DataTypes.STRING,
 
  },
  brandname: {
    type: DataTypes.STRING,
 
  },
  totamount : {
    type: DataTypes.DECIMAL,
 
  },
  sentamount : {
    type: DataTypes.DECIMAL,
 
  },
  status: {
    type: DataTypes.STRING,
 
  },
  sentfrom: {
    type: DataTypes.STRING,
 
  },
  transfercontroller:{
    type: DataTypes.STRING,
  },
  transferdate:{
    type: DataTypes.DATE,
  }

  
})
    return ProductRequest;
};


