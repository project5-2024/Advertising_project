import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectToDB() {
    try{
        await client.connect();
        db = client.db(process.env.DATABASE_NAME);
        console.log("Connected to DB")
      }catch (error){
        console.error("Failed to connect", error);
        process.exit(1);
      }
}

export function getDB() {
    if (!db) {
        throw new Error("Database is not initialized");
    }
    return db;
}
//
//async function db_insert_user_login(name, hash){
//    try{
//      const database = client.db(database_name);
//      const users = database.collection(users_collection);
//  
//      const doc = {
//        username: name,
//        password: hash
//      };
//  
//      const result = await users.insertOne(doc);
//      return result;
//  
//    } finally {
//      console.log("user inserted to DB")
//    }
//  }
//  
//  async function set_userdata(name, userdata, admin){
//    try{
//      const database = client.db(database_name);
//      const users = database.collection(users_collection);
//  
//      const query = {
//        username: name,
//      };
//  
//      const new_values = {
//        $set: {
//          ad_preferences: userdata,
//          is_admin: admin
//        }
//      };
//  
//      const result = await users.updateOne(query,new_values, function(err, res) {
//        if (err) throw err;
//        console.log("1 document updated");
//      });
//      return result;
//    }
//    finally{
//      console.log("user updated")
//    }
//  }
//   
//  async function db_insert_ad(company_name ,image, data){
//    try{
//      const database = client.db(database_name);
//      const ads = database.collection(ads_collections);
//  
//      const doc = {
//        ad_name: company_name,
//        ad_image: image,
//        ad_preferences: data
//      };
//      const result = await ads.insertOne(doc);
//      return result;
//    } finally {
//      console.log("ad inserted to DB")
//    }
//  }
//  
//  async function fetch_ad(name){
//    try{
//      const database = client.db(database_name);
//      const users = database.collection(ads_collections);
//  
//      const query = {
//        company_name: name
//      };
//  
//      const result = await users.findOne(query);
//      console.log(result);
//      return result;
//    } finally {
//      console.log("check if user name is taken")
//    }
//  }
//  
//  async function fetch_userdata(name){
//    try{
//      const database = client.db(database_name);
//      const users = database.collection(users_collection);
//  
//      const query = {
//        username: name
//      };
//  
//      const result = await users.findOne(query);
//      console.log(result);
//      return result;
//    } finally {
//      console.log("check if user name is taken")
//    }
//  }
//  
//  
//  
//  async function authenticate_user(name, hash){
//    try{
//      const database = client.db(database_name);
//      const users = database.collection(users_collection);
//  
//      const query = {
//        username: name,
//        password: hash,
//      };
//  
//      const options = {
//        projection: {
//          _id: 0,
//          ad_preferences: 0,
//          is_admin: 0,
//        },
//      };
//      
//      const result = await users.findOne(query,options);
//      return result;
//    } finally {
//      console.log("authenticate_user")
//    }
//  }