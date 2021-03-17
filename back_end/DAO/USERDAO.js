const bcrypt = require("bcrypt");
let users;

class USERDAO {
  static async injectDB(connection) {
    try {
      users = await connection.db().collection("users");
      await users.createIndex({ username: 1 });
    } catch (err) {
      console.log(err.toString());
    }
  }

  static async findUserByEmail(email) {
    try {
      const user = await users.findOne({
        "email.value": email,
      });
      return user;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async findUserByUsername(username) {
    try {
      const user = await users.findOne({
        username: username,
      });
      return user;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async findUser(username) {
    try {
      const user = await users.findOne({
        $or: [{ username: username }, { email: username }],
      });
      return user;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async insertUser(formData) {
    try {
      const { username, password, email, firstname, lastname } = formData;
      const hashedPassoword = await bcrypt.hash(password, 10);
      const result = await users.insertOne({
        username: username,
        password: hashedPassoword,
        name: { firstname: firstname, lastname: lastname },
        email: { value: email, verify: false },
        photo: null,
        matches: [],
        lang: "English",
        failedLoginAttempt: 0,
        failedVerifyAttempt: 0,
        inGame: false,
      });

      return result.ops[0];
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateFailedLoginAttempt(username) {
    try {
      const result = await users.findOneAndUpdate(
        {
          $or: [{ username: username }, { email: username }],
        },
        { $inc: { failedLoginAttempt: 1 } },
        { returnOriginal: false }
      );
      return result.value.failedLoginAttempt;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateUserEmail(username) {
    try {
      const result = await users.findOneAndUpdate(
        {
          username: username,
        },
        { $set: { "email.verify": true } },
        { returnOriginal: false }
      );
      return result.value;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateFailedVerifyAttempt(username) {
    try {
      const result = await users.findOneAndUpdate(
        {
          username: username,
        },
        { $inc: { failedVerifyAttempt: 1 } },
        { returnOriginal: false }
      );
      return result.value.failedVerifyAttempt;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async resetFailedVerifyAttempt(username) {
    try {
      await users.findOneAndUpdate(
        {
          $or: [{ username: username }, { email: username }],
        },
        { $set: { failedVerifyAttempt: 0 } }
      );
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async resetFailedLoginAttempt(username) {
    try {
      await users.findOneAndUpdate(
        {
          $or: [{ username: username }, { email: username }],
        },
        { $set: { failedLoginAttempt: 0 } }
      );
    } catch (err) {
      throw new Error(err.toString());
    }
  }
}

module.exports = USERDAO;
