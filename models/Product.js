module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("Product", {
      productid: {
        type: DataTypes.STRING,
     
      },
  productname: {
    type: DataTypes.STRING,
 
  },
  productcode: {
    type: DataTypes.STRING,
 
  },
  plasticneed: {
    type: DataTypes.DECIMAL,
 
  },
   fibericneed: {
    type: DataTypes.DECIMAL,
 
  }

  
})
    return Product;
};


