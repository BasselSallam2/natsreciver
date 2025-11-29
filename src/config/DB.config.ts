import mongoose from "mongoose";

const dbConnection = mongoose.connection;

dbConnection.on("connected", () => {
  console.log("MongoDB: Connection established.");
});

dbConnection.on("error", (error) => {
  console.error(`MongoDB: Connection error: ${error}`);
});

dbConnection.on("disconnected", () => {
  console.log("MongoDB: Connection disconnected.");
});

dbConnection.on("close", () => {
  console.log("MongoDB: Connection closed.");
});

const mongoURI = `mongodb+srv://empo:Bassel12@cluster0.jfpug.mongodb.net/testnats?retryWrites=true&w=majority&appName=nats&journal=true`


export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
