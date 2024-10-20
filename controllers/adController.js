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
  
  export async function fetchAd(db, name) {
    const ads = db.collection("ads");
    return await ads.findOne({ ad_name: name });
  }
  