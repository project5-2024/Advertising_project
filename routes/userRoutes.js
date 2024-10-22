import express from "express";
import { registerUser, loginUser, updateUserData, getParameters } from "../controllers/userController.js";
import Joi from "joi";

const router = express.Router();

export default (db) => {

    router.post("/register", async (req, res) => {
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(6).required(),
            is_admin: Joi.number().integer().min(0).max(1).required(),
        });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send( {error: error.details[0].message });

        try {
            const userId = await registerUser(db, req.body.username, req.body.password, req.body.is_admin);
            res.status(201).send({userId});
        }catch (error){
            res.status(500).send({ error: error.message })
        }
    })

    router.post("/login", async (req, res) => {
        const { username, password } = req.body;
    
        try {
          const userId = await loginUser(db, username, password);
          if (userId) {
            res.status(200).send({ userId });
          } else {
            res.status(401).send({ error: "Invalid credentials" });
          }
        } catch (error) {
          res.status(500).send({ error: error.message });
        }
      });

      router.put("/set_parameters/:username", async (req, res) => {
        const { username } = req.params;
        const { userdata } = req.body;
    
        try {
          const result = await updateUserData(db, username, userdata);
          if (result.modifiedCount > 0) {
            res.status(200).send({ message: "User data updated" });
          } else {
            res.status(404).send({ error: "User not found" });
          }
        } catch (error) {
          res.status(500).send({ error: error.message });
        }
      });

      router.post("/get_parameters/:userID", async (req, res) => {
        const { userID } = req.params;
        console.log(userID);

        try{
          const result = await getParameters(db, userID);
          if (result){
            res.status(200).send(result);
          }else {
            res.status(404).send({error: "User not found"});
          }
        }catch (error){
          res.status(500).send({error: error.message})
        }
      })

      
    
      return router;

}









