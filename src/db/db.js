import mongoose from "mongoose";

async function conncectDB() {
  try {
    const conncetion = await mongoose.connect(`${process.env.MONGDB_URL}`);
    console.log(`Database connceted Sucessfully`);
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
}

export default conncectDB;
