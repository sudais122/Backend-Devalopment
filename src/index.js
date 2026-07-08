import { app } from "./app.js";
import conncectDB from "./db/db.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

async function startserver() {
  try {
    await conncectDB();
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`Database connection failed`);
    process.exit(1);
  }
}

startserver();
