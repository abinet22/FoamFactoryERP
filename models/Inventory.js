module.exports = (sequelize, DataTypes) => {

    const Inventory = sequelize.define("Inventory", {
        invid: {
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

  warehouseid : {
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
 
  }


  
})
    return Inventory;
};


