import express from "express";
import { createAd, fetchAd } from "../controllers/adController.js";

const router = express.Router();

export default (db) => {
  router.post("/", async (req, res) => {
    const { name, ad_data, image } = req.body;

    try {
      const ad = await createAd(db, name, ad_data, image);
      res.status(201).send(ad);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  router.get("/:name", async (req, res) => {
    try {
      const ad = await fetchAd(db, req.params.name);
      if (ad) {
        res.status(200).send(ad);
      } else {
        res.status(404).send({ error: "Ad not found" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  return router;
};
