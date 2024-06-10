module.exports = (sequelize, DataTypes) => {

    const Price = sequelize.define("Price", {
      priceid: {
        type: DataTypes.STRING,
     
      },
  shopid: {
    type: DataTypes.STRING,
 
  },
  productid: {
    type: DataTypes.STRING,
 
  },
  brandid: {
    type: DataTypes.STRING
  },

  proprice: {
    type: DataTypes.DECIMAL(10,3)
  }
  
})
    return Price;
};


