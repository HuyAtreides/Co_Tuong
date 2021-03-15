const bcrypt = require("bcrypt");
let users;

class USERDAO {
  static async injectDB(connection) {
    try {
      users = await connection.db().collection("users");
      await users.createIndex({ username: 1 });
    } catch (e) {
      console.log(e.toString());
    }
  }

  static async findUser(username) {
    try {
      const user = await users.findOne({ username: username });
      return [null, user];
    } catch (e) {
      return [e, null];
    }
  }

  static async insertUser(formData) {
    try {
      const { username, password, email, firstname, lastname } = formData;
      const [error, user] = await USERDAO.findUser(username);
      if (error) return [e, null];
      else if (user) return ["Username isn't available", null];
      const hashedPassoword = await bcrypt.hash(password, 10);
      const result = await users.insertOne({
        username: username,
        password: hashedPassoword,
        name: { firstname: firstname, lastname: lastname },
        email: email,
        photo: null,
      });

      return result.ops[0];
    } catch (e) {
      return [e, null];
    }
  }
}

module.exports = USERDAO;
