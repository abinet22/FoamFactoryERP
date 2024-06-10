
module.exports = (sequelize, DataTypes) => {

    const BlockProductionLog = sequelize.define("BlockProductionLog", {
      blockid: {
        type: DataTypes.STRING,
     
      },
      productlist: {
    type: DataTypes.JSON,
 
  },

  wipaddby: {
    type: DataTypes.STRING,
  
   },

  
})
    return BlockProductionLog;
};


