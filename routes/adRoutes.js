import express from "express";
import { createAd, fetchAd, fetchRelevantAds } from "../controllers/adController.js";

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

  router.get("/fetch_ad/:ad_id", async (req, res) => {
    try {
      const ad = await fetchAd(db, req.params.ad_id);
      if (ad) {
        res.status(200).send(ad);
      } else {
        res.status(404).send({ error: "Ad not found" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });


  const temp = {
    sports: 85,
    music: 84, 
    food: 24,
    travel: 76,
    movies: 76,
    technology: 56, 
    fitness: 99,
    gaming: 16,
    books: 45,
    fashion: 0
  }

  router.get("/fetch_ads/", async (req, res) => {
    try {
      const ads = await fetchRelevantAds(db, temp);
      console.log(ads);
      if (ads) {
        res.status(200).send(ads);
      } else {
        res.status(404).send({ error: "Ad not found" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  

  return router;
};
