const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.set("strictQuery", false);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);
    ////or////
    // await mongoose.connect(
    //   // "mongodb+srv://fwjobs:u6Q6YRBMUFThOUR8@cluster0.thv9xbf.mongodb.net/fwjobs?retryWrites=true&w=majority"
    // );
    console.log("Connected");
  } catch (error) {
    console.log(error.message);
  }
}

// export default connectDB;
module.exports = connectDB;