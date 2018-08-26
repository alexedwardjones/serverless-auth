const name = 'user';

const attributes = {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
}; 

const options = {
  timestamps: true
}

const User = sequelize.define(name, attributes, options);

export default User;
