import mongoose from "mongoose";

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/supportlive";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data) => {
      console.log(`Connected to ${data.connection.name} database`);
    });
  } catch (err) {
    console.log(err.message);
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

export default connectDB;
