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
      user = await users.findOne({ username: username });
      return [null, user];
    } catch (e) {
      return [e, null];
    }
  }
}

module.exports = USERDAO;
