import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  transaction_type: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  paymentId:{
    type:String
  },
  status:String,
  recepient: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  }
},{timestamps:true});

const Transactions = mongoose.model("transactions", transactionSchema);
export default Transactions;
