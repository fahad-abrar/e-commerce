import mongoose, { connect } from "mongoose";

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "ecommerce",
    });
    console.log("connected to the database");
  } catch (err) {
    console.log(
      `an error is occured while connecting to database ${err.message}`
    );
  }
};

export default databaseConnection;
