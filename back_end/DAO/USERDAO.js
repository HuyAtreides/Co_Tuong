const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const nonAccentVietnamese = require('./nonAccentVietnamese.js');
let users;

class USERDAO {
  static async injectDB(connection) {
    try {
      users = await connection.db().collection('users');
      await users.createIndex({ username: 1 });
    } catch (err) {
      console.log(err.toString());
    }
  }

  static async updateUserLang(username, lang) {
    try {
      await users.updateOne({ username: username }, { $set: { lang: lang } });
    } catch (err) {
      console.log(err.message);
    }
  }

  static async findUserByEmail(email) {
    try {
      const user = await users.findOne({
        'email.value': email,
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
      const regex = new RegExp(`${playername}`, 'i');
      const result = await users.find({ username: exact ? playername : regex });
      const players = await result
        .project({
          username: 1,
          photo: 1,
          socketID: 1,
          name: 1,
          join: 1,
          guest: 1,
        })
        .toArray();
      return players;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async setSocketID(username, id, set) {
    const result = await users.findOneAndUpdate(
      { username: username },
      set ? { $set: { socketID: id } } : { $unset: { socketID: '' } },
    );
    return result.value;
  }

  static async findUser(username) {
    try {
      const result = await users.findOneAndUpdate(
        {
          $or: [{ username: username }, { 'email.value': username }],
        },
        { $set: { lastOnline: new Date() } },
        { returnOriginal: false },
      );
      return result.value;
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
              $slice: 20,
              $sort: { date: -1 },
            },
          },
          $inc: {
            'totalGames.won': result === 'Won' ? 1 : 0,
            'totalGames.lost': result === 'Lost' ? 1 : 0,
            'totalGames.draw': result === 'Draw' ? 1 : 0,
          },
        },
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  static async removeGuest(guestName) {
    try {
      await users.deleteOne({ username: guestName });
    } catch (err) {
      console.log(err.message);
    }
  }

  static async insertGuest() {
    try {
      const result = await users.insertOne({
        username: 'guest' + Date.now(),
        name: { lastname: null, firstname: null },
        guest: true,
        photo: 'images/Pieces/general-black.png',
      });
      return result.ops[0];
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateUserProfilePic(id, filename) {
    try {
      const result = await users.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: {
            photo: `https://co-tuong-online.herokuapp.com/uploads/profile_pictures/${filename}`,
          },
        },
        { returnOriginal: false },
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
        { returnOriginal: false },
      );
      if (result.value) {
        return result.value;
      } else {
        const sanitizedName = nonAccentVietnamese(profile.displayName);
        const user = await users.findOne({
          username: sanitizedName,
        });

        const username = user ? `${sanitizedName}-${provider}-${id}` : sanitizedName;
        const result = await users.insertOne({
          username: username,
          provider: provider,
          userID: id,
          email: {
            value: email && email.value ? email.value : null,
            verified: true,
          },
          photo: profile.photos ? profile.photos[0].value : '/images/default_avatar.png',
          name: {
            firstname: name && name.familyName ? name.familyName : '',
            lastname: name && name.givenName ? name.givenName : '',
          },
          lang: 'English',
          totalGames: { lost: 0, won: 0, draw: 0 },
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
        email: { value: email, verified: true },
        photo: 'images/default_avatar.png',
        totalGames: { lost: 0, won: 0, draw: 0 },
        matches: [],
        lastOnline: new Date(),
        join: new Date(),
        lang: 'English',
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
          $or: [{ username: username }, { 'email.value': username }],
        },
        { $inc: { failedLoginAttempt: 1 } },
        { returnOriginal: false },
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
        { $set: { 'email.verified': true } },
        { returnOriginal: false },
      );
      return result.value;
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async updateUserProfile(changes, username) {
    try {
      if (changes.password) changes.password = await bcrypt.hash(changes.password, 10);
      const result = await users.findOneAndUpdate(
        { username: username },
        {
          $set: changes,
        },
        { returnOriginal: false },
      );
      return result.value;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updateFailedVerifyAttempt(username) {
    try {
      const result = await users.findOneAndUpdate(
        {
          $or: [{ username: username }, { 'email.value': username }],
        },
        { $inc: { failedVerifyAttempt: 1 } },
        { returnOriginal: false },
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
          $or: [{ username: username }, { 'email.value': username }],
        },
        { $set: { failedVerifyAttempt: 0 } },
      );
    } catch (err) {
      throw new Error(err.toString());
    }
  }

  static async resetFailedLoginAttempt(username) {
    try {
      await users.findOneAndUpdate(
        {
          $or: [{ username: username }, { 'email.value': username }],
        },
        { $set: { failedLoginAttempt: 0 } },
      );
    } catch (err) {
      throw new Error(err.toString());
    }
  }
}

module.exports = USERDAO;
