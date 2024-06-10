module.exports = (sequelize, DataTypes) => {

    const MaterialName = sequelize.define("MaterialName", {
      rmid: {
        type: DataTypes.STRING,
     
      },
  rmname: {
    type: DataTypes.STRING,
 
  },
  rmtype: {
    type: DataTypes.STRING,
 
  },
  fbrand:{
    type: DataTypes.STRING,
  }
})
    return MaterialName;
};


