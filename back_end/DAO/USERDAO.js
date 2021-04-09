const bcrypt = require("bcrypt");
const ObjectID = require("mongodb").ObjectID;
const nonAccentVietnamese = require("./nonAccentVietnamese.js");
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

  static async findPlayers(playername, exact) {
    try {
      const regex = new RegExp(`${playername}`, "i");
      const result = await users.find({ username: exact ? playername : regex });
      const players = await result
        .project({ username: 1, photo: 1, socketID: 1 })
        .toArray();
      return players;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async setSocketID(username, id, set) {
    const result = await users.findOneAndUpdate(
      { username: username },
      set ? { $set: { socketID: id } } : { $unset: { socketID: "" } }
    );
    return result.value;
  }

  static async findUser(username) {
    try {
      const result = await users.findOneAndUpdate(
        {
          $or: [{ username: username }, { "email.value": username }],
        },
        { $set: { lastOnline: new Date() } },
        { returnOriginal: false }
      );
      return result.value;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateUserInGame(username, isInGame) {
    try {
      await users.findOneAndUpdate(
        { username: username },
        { $set: { inGame: isInGame } }
      );
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateMatchHistory(socket, result, reason) {
    const player = socket.player;
    const opponent = socket.opponent;
    const time = socket.time;
    const match = {
      opponent: opponent.playername,
      result: result,
      date: new Date(),
      reason: reason,
      time: time,
    };
    try {
      await users.updateOne(
        { username: player.playername },
        {
          $push: {
            matches: {
              $each: [match],
              $slice: 17,
              $sort: { date: -1 },
            },
          },
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  static async removeGuest(guestName) {
    try {
      await users.deleteOne({ username: guestName });
    } catch (err) {
      console.log(err.toString());
    }
  }

  static async insertGuest() {
    try {
      const cursor = await users.find({ guest: true });
      const guests = await cursor.sort("number", -1).toArray();
      const num = guests[0] ? guests[0].number + 1 : 1;
      const guestName = "Guest" + num;
      const result = await users.insertOne({
        username: guestName,
        name: { lastname: null, firstname: null },
        guest: true,
        number: num,
        photo: "images/Pieces/general-black.png",
      });
      return result.ops[0];
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateUserProfilePic(id, filename) {
    try {
      const result = await users.findOneAndUpdate(
        { _id: ObjectID(id) },
        {
          $set: {
            photo: `http://localhost:8080/uploads/profile_pictures/${filename}`,
          },
        },
        { returnOriginal: false }
      );

      return result.value;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async createNewUser(profile) {
    try {
      const { id, provider, emails, name } = profile;
      const email = emails ? emails[0] : null;
      const result = await users.findOneAndUpdate(
        { userID: id, provider: provider },
        {
          $set: { lastOnline: new Date() },
        },
        { returnOriginal: false }
      );
      if (result.value) {
        return result.value;
      } else {
        const regex = new RegExp(`^${profile.displayName}`);
        const count = await users.countDocuments({
          username: regex,
        });
        const username = count
          ? profile.displayName + count
          : profile.displayName;
        const result = await users.insertOne({
          username: username,
          provider: provider,
          userID: id,
          email: {
            value: email && email.value ? email.value : null,
            verified: true,
          },
          photo: profile.photos
            ? profile.photos[0].value
            : `/user_profile_pic/${nonAccentVietnamese(
                username[0]
              ).toUpperCase()}.svg`,
          name: {
            firstname: name && name.familyName ? name.familyName : null,
            lastname: name && name.givenName ? name.givenName : null,
          },
          lang: "English",
          lastOnline: new Date(),
          join: new Date(),
          matches: [],
        });
        return result.ops[0];
      }
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async insertUser(formData) {
    try {
      const { username, password, email, firstname, lastname } = formData;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await users.insertOne({
        username: username,
        provider: null,
        userID: null,
        password: hashedPassword,
        name: { firstname: firstname, lastname: lastname },
        email: { value: email, verified: false },
        photo: `/user_profile_pic/${nonAccentVietnamese(
          username[0]
        ).toUpperCase()}.svg`,
        matches: [],
        lastOnline: new Date(),
        join: new Date(),
        lang: "English",
        failedLoginAttempt: 0,
        failedVerifyAttempt: 0,
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
          $or: [{ username: username }, { "email.value": username }],
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
        { $set: { "email.verified": true } },
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
          $or: [{ username: username }, { "email.value": username }],
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
          $or: [{ username: username }, { "email.value": username }],
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
          $or: [{ username: username }, { "email.value": username }],
        },
        { $set: { failedLoginAttempt: 0 } }
      );
    } catch (err) {
      throw new Error(err.toString());
    }
  }
}

module.exports = USERDAO;
