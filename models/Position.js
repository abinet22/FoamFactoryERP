module.exports = (sequelize, DataTypes) => {

    const Position = sequelize.define("Position", {
      positionid: {
        type: DataTypes.STRING,
     
      },
  positionname: {
    type: DataTypes.STRING,
 
  },


  is_active: {
    type: DataTypes.STRING
  }
  
})
    return Position;
};


