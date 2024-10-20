import bcrypt from "bcrypt";

export async function registerUser(db, username, password, isAdmin) {
  const users = db.collection("users");
  const existingUser = await users.findOne({ username });

  if (existingUser) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await users.insertOne({ username, password: hashedPassword,  is_admin: isAdmin });
  return result.insertedId;
}

export async function loginUser(db, username, password) {
  const users = db.collection("users");
  const user = await users.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    return user._id;
  } else {
    return null;
  }
}

export async function updateUserData(db, username, userdata) {
  const users = db.collection("users");
  const result = await users.updateOne(
    { username },
    { $set: { ad_preferences: userdata } }
  );
  return result;
}
