import { raw } from "express";

export async function createAd(db, name, adData, image) {
    const ads = db.collection("ads");
  
    const ad = {
      ad_name: name,
      ad_data: adData,
      ad_image: image,
    };
  
    const result = await ads.insertOne(ad);
    return result.insertedId;
  }
  
  export async function fetchAd(db, ad_id) {
    const ads = db.collection("ads");
    return await ads.findOne({ _id: ad_id });
  }

  export async function fetchRelevantAds(db, ad_preferences){
    const ads = db.collection("ads");
    var range = 5;
    const limit = 5;
    var size = 0;

    
    var ads_array= null;
    while (size < 6){
      const query = {
        "ad_data.sports": { $lte: ad_preferences.sports+range, $gte: ad_preferences.sports-range},
        "ad_data.music": { $lte: ad_preferences.music+range, $gte: ad_preferences.music-range},
        "ad_data.food": { $lte: ad_preferences.food+range, $gte: ad_preferences.food-range},
        "ad_data.travel": { $lte: ad_preferences.travel+range, $gte: ad_preferences.travel-range},
        "ad_data.movies": { $lte: ad_preferences.movies+range, $gte: ad_preferences.movies-range},
        "ad_data.technology": { $lte: ad_preferences.technology+range, $gte: ad_preferences.technology-range},
        "ad_data.fitness": { $lte: ad_preferences.fitness+range, $gte: ad_preferences.fitness-range},
        "ad_data.gaming": { $lte: ad_preferences.gaming+range, $gte: ad_preferences.gaming-range},
        "ad_data.books": { $lte: ad_preferences.books+range, $gte: ad_preferences.books-range},
        "ad_data.fashion": { $lte: ad_preferences.fashion+range, $gte: ad_preferences.fashion-range}
      }
      ads_array = await ads.find(query).toArray();
      size = Object.getOwnPropertyNames(ads_array).length;
      range+=5;
      console.log(size);
      console.log(range);
    }
    
    return ads_array;
  }
  
 