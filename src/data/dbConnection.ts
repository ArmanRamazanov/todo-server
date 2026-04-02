import mongoose from "mongoose";

let retry = 3;

export const connectToDb = (cb: (err: any) => void) => {
  mongoose
    .connect(process.env.MONGO_DB!, { family: 4 })
    .then(() => {
      console.log("MongoDB connected");
      cb(null);
    })
    .catch((err) => {
      if (retry > 0 && process.env.NODE_ENV === "production") {
        retry--;
        setTimeout(() => connectToDb(cb), 5000);
      } else {
        cb(err);
      }
    });
};
