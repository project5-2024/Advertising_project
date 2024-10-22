import express from "express";
import { createAd, fetchAd, fetchRelevantAds } from "../controllers/adController.js";
import { getParameters } from "../controllers/userController.js";

const router = express.Router();

export default (db) => {
  router.post("/insert_ad/", async (req, res) => {
    const { name, ad_data, image } = req.body;

    try {
      const ad = await createAd(db, name, ad_data, image);
      res.status(201).send(ad);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  router.get("/fetch_ad/:userID", async (req, res) => {
    try {
      const userPreferences = await getParameters(db, req.params.userID);
      if (userPreferences) {
        const ads = await fetchRelevantAds(db, userPreferences);
        if (ads){
          res.status(200).send(ads)
        }else {
          res.status(404).send({ error: "Ads not found" });
        }
      }else {
        res.status(404).send({ error: "User not found" });
      } 
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });


  router.get("/fetch_ads/", async (req, res) => {
    const { ad_data } = req.body;
    try {
      const ads = await fetchRelevantAds(db, ad_data);
      console.log(ads);
      if (ads) {
        res.status(200).send(ads._id);
      } else {
        res.status(404).send({ error: "Ad not found" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  

  return router;
};





