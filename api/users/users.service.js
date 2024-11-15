const User = require("./users.model");
const bcrypt = require("bcrypt");

class UsersService {
  async getAll() {
    return User.find({}, "-password");
  }

  async get(id) {
    return User.findById(id, "-password");
  }

  async create(data) {
    const user = new User(data);
    return user.save();
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return User.deleteOne({ _id: id });
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = new UsersService();
