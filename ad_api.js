import express from "express";
import { MongoClient } from "mongodb";
const app = express();
const port = 3000;
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000";
const client = new MongoClient(uri);
const database_name = "Project5DB";
const users_collection = "users";
const ads_collections = "ads";
// HTTPS Gets 

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/register/username/:username/password/:password", async (req,res) => {
  if (!check_username_taken){
    db_insert_user_login(req.params.username, req.params.password, "idk some data");
    res.send(req.params);
  }else {
    res.send("Username taken");
  }
})

app.get("/login/username/:username/password/:password", async (req,res) => {  
  const userlogin = await authenticate_user(req.params.username, req.params.password);
  console.log(userlogin);
  console.log(req.params);
  if(JSON.stringify(req.params) === JSON.stringify(userlogin)){
    console.log("Working")
    res.send(req.params);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});


// MONGO Functions

async function db_insert_user_login(name, hash, userdata){
  try{
    const database = client.db(database_name);
    const users = database.collection(users_collection);

    const doc = {
      username: name,
      password: hash,
      ad_preferences: userdata
    };

    const result = await users.insertOne(doc);
   

  } finally {
    console.log("user inserted to DB")
  }
}
 
async function db_insert_ad(image, ad_data){
  try{
    const database = client.db(database_name);
    const ads = database.collection(ads_collections);

    const doc = {
      ad_image: image,
      ad_preferences: ad_data
    };
    const result = await ads.insertOne(doc);
  } finally {
    console.log("ad inserted to DB")
  }
}

async function check_username_taken(name){
  try{
    const database = client.db(database_name);
    const users = database.collection(users_collection);

    const query = {
      username: name,
    };

    const result = await users.findOne(query);

    if (result == null){
      return false;
    }
    else {
      return true;
    } 
  } finally {
    console.log("check if user name is taken")
  }
}

async function authenticate_user(name, hash){
  try{
    const database = client.db(database_name);
    const users = database.collection(users_collection);

    const query = {
      username: name,
      password: hash,
    };

    const options = {
      projection: {
        _id: 0,
        ad_preferences: 0,
      },
    };
    
    const result = await users.findOne(query,options);
    return result;
  } finally {
    console.log("authenticate_user")
  }
}

