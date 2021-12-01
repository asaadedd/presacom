import { environment } from "../../environments/environment";
import { Mongoose, connect } from "mongoose";

export let db: Mongoose;

export const initDb = async () => {
  try {
    db = await connect(environment.dbUrl);
  } catch (e) {
    console.log('DB connection failed', e);
  }
};
