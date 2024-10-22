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
    var size = 0;
    const limit =5;
  
    var ads_array= null;
    while (size < 6 && range<100){
      
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
      

    const query1 = [
      {
        $project: {
          sportsMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.sports", ad_preferences.sports - range] },
                  { $lte: ["$ad_data.sports", ad_preferences.sports + range] }
              ] }, 
              1, 0 
            ] 
          },
          musicMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.music", ad_preferences.music - range] },
                  { $lte: ["$ad_data.music", ad_preferences.music + range] }
              ] }, 
              1, 0 
            ] 
          },
          foodMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.food", ad_preferences.food - range] },
                  { $lte: ["$ad_data.food", ad_preferences.food + range] }
              ] }, 
              1, 0 
            ] 
          },
          travelMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.travel", ad_preferences.travel - range] },
                  { $lte: ["$ad_data.travel", ad_preferences.travel + range] }
              ] }, 
              1, 0 
            ] 
          },
          moviesMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.movies", ad_preferences.movies - range] },
                  { $lte: ["$ad_data.movies", ad_preferences.movies + range] }
              ] }, 
              1, 0 
            ] 
          },
          technologyMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.technology", ad_preferences.technology - range] },
                  { $lte: ["$ad_data.technology", ad_preferences.technology + range] }
              ] }, 
              1, 0 
            ] 
          },
          fitnessMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.fitness", ad_preferences.fitness - range] },
                  { $lte: ["$ad_data.fitness", ad_preferences.fitness + range] }
              ] }, 
              1, 0 
            ] 
          },
          gamingMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.gaming", ad_preferences.gaming - range] },
                  { $lte: ["$ad_data.gaming", ad_preferences.gaming + range] }
              ] }, 
              1, 0 
            ] 
          },
          booksMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.books", ad_preferences.books - range] },
                  { $lte: ["$ad_data.books", ad_preferences.books + range] }
              ] }, 
              1, 0 
            ] 
          },
          fashionMatch: { 
            $cond: [
              { $and: [
                  { $gte: ["$ad_data.fashion", ad_preferences.fashion - range] },
                  { $lte: ["$ad_data.fashion", ad_preferences.fashion + range] }
              ] }, 
              1, 0 
            ] 
          },
          ad_image: 1
        }
      },
      {
        $match: {
          $expr: {
            $gte: [
              {
                $add: [
                  "$sportsMatch",
                  "$musicMatch",
                  "$foodMatch",
                  "$travelMatch",
                  "$moviesMatch",
                  "$technologyMatch",
                  "$fitnessMatch",
                  "$gamingMatch",
                  "$booksMatch",
                  "$fashionMatch"
                ]
              },
              3 
            ]
          }
        }
      },
      {
        $project: {
          ad_image : 1,
          _id: 0
          }
        }
    ];
      
      ads_array = await ads.aggregate(query1).limit(limit).toArray();
      size = Object.getOwnPropertyNames(ads_array).length;
      range+=5;
      console.log(size);
      console.log(range);
    }
    
    return ads_array;
  }
  
 