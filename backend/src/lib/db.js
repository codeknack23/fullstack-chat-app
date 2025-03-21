import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connected : " + connection.connection.host);
  } catch (err) {
    console.log("Mongo DB error : " + err);
  }
};
