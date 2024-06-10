module.exports = (sequelize, DataTypes) => {

    const FinalProduct = sequelize.define("FinalProduct", {
        fpid: {
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
  processby: {
    type: DataTypes.STRING,
 
  },
  addedtowarehouse: {
    type: DataTypes.STRING,
 
  },
  brandid: {
    type: DataTypes.STRING,
 
  },
  totalfinal: {
    type: DataTypes.DECIMAL,
 
  },
  status:{
  
      type: DataTypes.STRING,
   
    
  }


  
})
    return FinalProduct;
};


