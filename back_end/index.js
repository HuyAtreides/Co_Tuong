require("dotenv").config();
const server = require("./app.js");
const MongoClient = require("mongodb").MongoClient;
const USERDAO = require("./DAO/USERDAO.js");
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;

MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async (client) => {
    try {
      await USERDAO.injectDB(client);
      console.log("connected to mongodb");
      server.listen(PORT, () => {
        console.log(`listening at port ${PORT}`);
      });
    } catch (e) {
      console.log(e.toString());
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log(err);
  });
