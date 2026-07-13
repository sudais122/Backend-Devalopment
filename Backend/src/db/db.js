import mongoose from "mongoose";

async function connectDB() {
  try {
    const connection = await mongoose.connect("mongodb+srv://dorianoopiii_db_user:KqZdKbrkOYimTMBn@cluster0.bnveft4.mongodb.net/?appName=Cluster0");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

export default connectDB;