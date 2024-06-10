module.exports = (sequelize, DataTypes) => {

    const RowMaterial = sequelize.define("RowMaterial", {
        rmid: {
            type: DataTypes.STRING,
         
          },
      rowmaterialid: {
        type: DataTypes.STRING,
     
      },
      rowmaterialname: {
    type: DataTypes.STRING,
 
  },
 

  warehouseid : {
    type: DataTypes.STRING,
 
  },
  scaletype : {
    type: DataTypes.STRING,
 
  },
  totamount : {
    type: DataTypes.DECIMAL(10,2),
 
  },
  unitmeasure : {
    type: DataTypes.STRING,
 
  },


  
})
    return RowMaterial;
};


