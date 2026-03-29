import { MongoClient, Db } from "mongodb";

let dbConnection: Db;
let retry = 3;

export const connectToDb = (cb: (err: any) => void) => {
  console.log("Connecting to:", process.env.MONGO_DB);
  MongoClient.connect(process.env.MONGO_DB!, { family: 4 })
    .then((client) => {
      dbConnection = client.db();
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

export const getDb = () => dbConnection;
