module.exports = (sequelize, DataTypes) => {

    const BlockProduction = sequelize.define("BlockProduction", {
      blockid: {
        type: DataTypes.STRING,
     
      },
  materialusedlist: {
    type: DataTypes.JSON,
 
  },
  estitotalcost: {
    type: DataTypes.DECIMAL,
 
  },
  estitotalblock: {
    type: DataTypes.DECIMAL,
 
  },
  werehouse:{
    type: DataTypes.STRING,
  },
  status:{
    type: DataTypes.STRING,
  },
  batchname:{
    type: DataTypes.STRING,
  },
  isfinished:{
    type: DataTypes.STRING,
  }
})
    return BlockProduction;
};


