const mongoose = require("mongoose");
const uri = "mongodb+srv://admin:admin@mycluster.u7dcvub.mongodb.net/football?retryWrites=true&w=majority&appName=MyCluster";

async function run() {
  try {
    mongoose.connect(uri)
    console.log("successfully connected to MongoDB!");
  } catch(error) {
    console.log(error);
  }
}

module.exports = {run};
