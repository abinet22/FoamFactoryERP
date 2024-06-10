module.exports = (sequelize, DataTypes) => {

    const Customer = sequelize.define("Customer", {
      cusid: {
        type: DataTypes.STRING,
     
      },
  fullname: {
    type: DataTypes.STRING,
 
  },

  phone_number: {
    type: DataTypes.STRING,
  
   },
  tinnumber: {
    type: DataTypes.STRING
  },
 
  address: {
    type: DataTypes.STRING
  }
  
})
    return Customer;
};


