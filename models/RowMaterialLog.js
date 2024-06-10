module.exports = (sequelize, DataTypes) => {

    const RowMaterialLog = sequelize.define("RowMaterialLog", {
     
      rowmaterialid: {
        type: DataTypes.STRING,
     
      },
      rowmaterialname: {
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
  }


  
})
    return RowMaterialLog;
};


