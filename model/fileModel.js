import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "user or product id is required"],
  },
  productId: {
    type: String,
    required: [false, "user or product id is required"],
  },
  public_id: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
});
const File = mongoose.model("File", fileSchema);
export default File;
