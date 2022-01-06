import { environment } from "../../environments/environment";
import { Mongoose, connect } from "mongoose";
import { exec } from "child_process";

export let db: Mongoose;

// const dumps = ['distributorstocks', 'outlets', 'products', 'supplierorders', 'suppliers', 'supplierstocks'];
const dumps = [
  'distributororders', 'distributorstocks', 'products',
  'outletorders', 'outlets', 'outletstocks',
  'supplierorders', 'suppliers', 'supplierstocks', 
];


const initDataForCollection = async (collection: string) => {
  const collectionKey = Object.keys(db.models).find((key) => `${key.toLowerCase()}s` === collection);
  if (collectionKey) {
    const entries =  await db.models[collectionKey].find().exec();
    if (entries.length) {
      return;
    }
  }
  return new Promise((response, reject) => {
    exec(`mongoimport --db presacom2 --collection ${collection} --jsonArray --drop --file ./apps/server/dumps/${collection}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      response(stdout);
    });
  })
}

const initData = () => {
  return Promise.all(dumps.map((c) => initDataForCollection(c)));
}

export const initDb = async () => {
  try {
    db = await connect(environment.dbUrl);
    await initData();
  } catch (e) {
    console.log('DB connection failed', e);
  }
};
