module.exports = (sequelize, DataTypes) => {

    const Employee = sequelize.define("Employee", {
      cusid: {
        type: DataTypes.STRING,
     
      },
  fullname: {
    type: DataTypes.STRING,
 
  },

  phone_number: {
    type: DataTypes.STRING,
  
   },
  salary: {
    type: DataTypes.DECIMAL
  },
  emptype: {
    type: DataTypes.STRING
  },
  position: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  empphoto: {
    type: DataTypes.BLOB("long"),
  },
  overtimerate: {
    type: DataTypes.DECIMAL
  },
  bonusrate:{
    type: DataTypes.DECIMAL
  },
  salarytype: {
    type: DataTypes.STRING
  },
  isactive: {
    type: DataTypes.STRING
  }
  
})
    return Employee;
};


