// src/config/db.js
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

//import express from "express"
//mconst app = express()


const connectDB = async () => {
  try {
   const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
   /* app.on("error", (error) =>{ console.log("ERROR: ", error);
        throw error
    })
    app.listen (process.env.PORT, () =>  {
        console.log(`App is listening on port ${process.env.PORT}`);
    })*/
    console.log('MongoDB Connected DB HOST: ${connectionInstance.connection.host}');
} catch (error) {
    console.log('MongoDB Connection Error:', error);
    process.exit(1);
  }
}

export default connectDB;


