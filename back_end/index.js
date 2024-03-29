require('dotenv').config();

const server = require('./app.js');
const MongoClient = require('mongodb').MongoClient;
const USERDAO = require('./DAO/USERDAO.js');
const USERIMGDAO = require('./DAO/USERIMGDAO.js');
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;

MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(async (client) => {
    try {
      await USERDAO.injectDB(client);
      USERIMGDAO.injectDB(client);
      console.log('connected to mongodb');
      server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
      });
    } catch (err) {
      console.log(err.message);
    }
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
