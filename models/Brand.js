module.exports = (sequelize, DataTypes) => {

    const Brand = sequelize.define("Brand", {
      brandid: {
        type: DataTypes.STRING,
     
      },
  brandname: {
    type: DataTypes.STRING,
 
  },

  

  is_active: {
    type: DataTypes.STRING
  }
  
})
    return Brand;
};


