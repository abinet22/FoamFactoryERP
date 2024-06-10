
module.exports = (sequelize, DataTypes) => {

    const BankAccount = sequelize.define("BankAccount", {
      baid: {
        type: DataTypes.STRING,
     
      },
  bankname: {
    type: DataTypes.STRING,
 
  },
  accountno: {
    type: DataTypes.STRING,
 
  },
  amount: {
    type: DataTypes.DECIMAL,
 
  },

  is_active: {
    type: DataTypes.STRING
  }
  
})
    return BankAccount;
};


