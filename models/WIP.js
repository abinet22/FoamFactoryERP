module.exports = (sequelize, DataTypes) => {

    const WIP = sequelize.define("WIP", {
        wipid: {
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
  wipprogress: {
    type: DataTypes.STRING,
 
  },
  totalwip: {
    type: DataTypes.DECIMAL,
 
  }


  
})
    return WIP;
};


