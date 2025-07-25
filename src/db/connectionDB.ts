import mongoose from "mongoose";

const dbName = "myDataBase";
const url = `mongodb://127.0.0.1:27017/${dbName}`;

const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

export const CheckDB = async () => {
  try {
    await mongoose.connect(url, options);
    console.log("Connected to MongoDB successfully as", dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
