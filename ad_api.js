import express from "express";
import { MongoClient } from "mongodb";
const app = express();
const port = 7832;
const uri = "mongodb://192.168.178.116:27017/?directConnection=true&serverSelectionTimeoutMS=2000";
const client = new MongoClient(uri);
const database_name = "Project5DB";
const users_collection = "users";
const ads_collections = "ads";


// HTTPS Gets 

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/register/username/:username/password/:password", async (req,res) => {
  const user_exists = await fetch_userdata(req.params.username);
  if (user_exists == null ){
    db_insert_user_login(req.params.username, req.params.password);
    const user = await fetch_userdata(req.params.username);
    res.status(200).send(user._id);
  }else {
    res.status(401).send({error: "Username taken"});
  }
})

app.get("/setdata/username/:username/userdata/:userdata/is_admin/:is_admin", async (req,res) => {
  const user = await set_userdata(req.params.username, req.params.userdata, req.params.is_admin);
  console.log(user);
  res.send(user);
})

app.get("/login/username/:username/password/:password", async (req,res) => {  
  const userlogin = await authenticate_user(req.params.username, req.params.password);
  console.log(userlogin);
  console.log(req.params);
  if(JSON.stringify(req.params) === JSON.stringify(userlogin)){
    const user = await fetch_userdata(req.params.username);
    res.status(200).send(user._id);
  }else{
    res.status(401).send({ error: "User not found or credentials do not match" });
  }
});



app.get("/insert_ad/name/:name/ad_data/:ad_data/image/*", async (req,res) => {
  const image = req.params[0];
  console.log(image);
  const ad = db_insert_ad(req.params.name, image, req.params.ad_data);
  res.status(200).send(ad);
});


app.get("/fetch_ad/name/:name", async (req,res) => {  
  const ad = fetch_ad(req.params.name);
  res.status(200).send(ad._id);
});

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});


// MONGO Functions

async function db_insert_user_login(name, hash){
  try{
    const database = client.db(database_name);
    const users = database.collection(users_collection);

    const doc = {
      username: name,
      password: hash
    };

    const result = await users.insertOne(doc);
    return result;

  } finally {
    console.log("user inserted to DB")
  }
}

async function set_userdata(name, userdata, admin){
  try{
    const database = client.db(database_name);
    const users = database.collection(users_collection);

    const query = {
      username: name,
    };

    const new_values = {
      $set: {
        ad_preferences: userdata,
        is_admin: admin
      }
    };

    const result = await users.updateOne(query,new_values, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
    return result;
  }
  finally{
    console.log("user updated")
  }
}
 
async function db_insert_ad(company_name ,image, data){
  try{
    const database = client.db(database_name);
    const ads = database.collection(ads_collections);

    const doc = {
      ad_name: company_name,
      ad_image: image,
      ad_preferences: data
    };
    const result = await ads.insertOne(doc);
    return result;
  } finally {
    console.log("ad inserted to DB")
  }
}

async function fetch_ad(name){
  try{
    const database = client.db(database_name);
    const users = database.collection(ads_collections);

    const query = {
      company_name: name
    };

    const result = await users.findOne(query);
    console.log(result);
    return result;
  } finally {
    console.log("check if user name is taken")
  }
}

async function fetch_userdata(name){
  try{
    const database = client.db(database_name);
    const users = database.collection(users_collection);

    const query = {
      username: name
    };

    const result = await users.findOne(query);
    console.log(result);
    return result;
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
        is_admin: 0,
      },
    };
    
    const result = await users.findOne(query,options);
    return result;
  } finally {
    console.log("authenticate_user")
  }
}

