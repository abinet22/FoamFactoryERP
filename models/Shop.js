module.exports = (sequelize, DataTypes) => {

    const Shop = sequelize.define("Shop", {
      shopid: {
        type: DataTypes.STRING,
     
      },
  shopname: {
    type: DataTypes.STRING,
 
  },

  shopaddress: {
    type: DataTypes.STRING,
  
   },

  is_active: {
    type: DataTypes.STRING
  }
  
})
    return Shop;
};


