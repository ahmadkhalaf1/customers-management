import { Document, Schema, model } from "mongoose";

export interface CustomerModel extends Document {
  customerID: Number;
  birthday: String;
  gender: String;
  name: {
    first: String;
    last: String;
  };
  customerLifetimeValue: Number;
  lastContact: Date;
}

const customerSchema = new Schema(
  {
    customerID: Number,
    birthday: String,
    gender: String,
    deleted: {
      type: Boolean,
      default: false
    },
    name: {
      first: String,
      last: String
    },
    customerLifetimeValue: Number,
    lastContact: Date
  },
  { timestamps: true }
);

const Customers = model<CustomerModel>("Customers", customerSchema);
export default Customers;
