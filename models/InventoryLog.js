module.exports = (sequelize, DataTypes) => {

    const InventoryLog = sequelize.define("InventoryLog", {
        invid: {
            type: DataTypes.STRING,
         
          },
      productid: {
        type: DataTypes.STRING,
     
      },
  productname: {
    type: DataTypes.STRING,
 
  },
 
  sentfrom : {
    type: DataTypes.STRING,
 
  },
  sentto : {
    type: DataTypes.STRING,
 
  },
  totamount : {
    type: DataTypes.DECIMAL,
 
  },
  actionmessage:{
    type: DataTypes.STRING,
  },
  status:{
    type: DataTypes.STRING,
  },
  brandname:{
    type: DataTypes.STRING,
  },


  
})
    return InventoryLog;
};


