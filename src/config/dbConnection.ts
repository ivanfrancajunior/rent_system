import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;
const MONGO_URI_TEST_DB = process.env.MONGO_URI_TEST_DB!;

const connection = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI_TEST_DB);

    if (conn) return console.log("database connected");

    return conn;
  } catch (error) {
    console.log("ERROR: ", error);
  }
};
connection();

export default connection;
