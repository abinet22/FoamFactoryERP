module.exports = (sequelize, DataTypes) => {

    const Warehouse = sequelize.define("Warehouse", {
        warehouseid: {
        type: DataTypes.STRING,
     
      },
      warehousename: {
    type: DataTypes.STRING,
 
  },

  warehouseaddress: {
    type: DataTypes.STRING,
  
   },
   ismain: {
    type: DataTypes.STRING
  },
  waretype: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.STRING
  }
  
})
    return Warehouse;
};


