import mongoose from "mongoose";

const dbName = "myDataBase";
const url = `mongodb://127.0.0.1:27017/${dbName}`;

const CheckDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB   successfully  as", dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export { CheckDB };
