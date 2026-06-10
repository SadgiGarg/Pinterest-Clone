import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './database/db.js';
import Pin from './models/pinModel.js';

// ✅ STEP 1: Paste your SECOND User ID here!
const secondaryUserId = "69caa904fddae6adb1df8b4c";

// A massive curated list of premium Unsplash fashion, clothing, and accessory image IDs
const fashionImagePool = [
  "photo-1539109136881-3be0616acf4b", "photo-1515886657613-9f3515b0c78f", 
  "photo-1556821840-3a63f95609a7", "photo-1509631179647-0177331693ae", 
  "photo-1618354691373-d851c5c3a990", "photo-1591047139829-d91aecb6caea", 
  "photo-1512436991641-6745cdb1723f", "photo-1485968579580-b6d095142e6e", 
  "photo-1620799140408-edc6dcb6d633", "photo-1549064482-6779ba329226", 
  "photo-1610030469983-98e550d6193c", "photo-1610030469668-93535c17b6b3", 
  "photo-1597983073493-88cd35cf93b0", "photo-1583391733956-3750e0ff4e8b", 
  "photo-1608748010899-18f300247112", "photo-1535632066927-ab7c9ab60908", 
  "photo-1556906781-9a412961c28c", "photo-1584917865442-de89df76afd3", 
  "photo-1511499767150-a48a237f0083", "photo-1539185441755-769473a23570",
  "photo-1496747611176-843222e1e57c", "photo-1505022610485-0249ba5b3675",
  "photo-1490481651871-ab68de25d43d", "photo-1525507119028-ed4c629a60a3",
  "photo-1479064555552-3ef4979f8908", "photo-1566207274740-0f8cf6b7d5a5",
  "photo-1581044777550-4cfa60707c03", "photo-1487222477894-8943e31ef7b2",
  "photo-1516257984-b1b4d707412e", "photo-1543163521-1bf539c55dd2"
];

const designKeywords = [
  "Minimalist Lookbook", "Vintage Aesthetic", "Urban Streetwear", "Parisian Chic", 
  "Retro Casual", "Boho Wardrobe", "Modern Ethnic Fusion", "Monochrome Palette",
  "Luxury Tailoring", "Cozy Layering", "Summer Capsule", "Autumn Essentials"
];

const descriptionDetails = [
  "Featuring premium fabrics, clean outlines, and neutral tones. Perfect for an everyday minimalist wardrobe look.",
  "An effortless blend of comfort and style. Ideal outfit inspiration for casual weekend coffee runs or campus streetwear views.",
  "Showcasing elegant patterns, detailed embroidery elements, and modern seasonal accessories for a highly stylized fashion layout.",
  "A classic aesthetic staple highlighting current streetwear trends, chunky platforms, and beautiful structural proportions."
];

// 🔄 THE AUTOMATIC LOOP: Builds exactly 100 fashion records instantly!
const fashionPins = [];

for (let i = 1; i <= 100; i++) {
  // Use simple math (%) to rotate through our image pool, keywords, and descriptions cleanly
  const imageId = fashionImagePool[i % fashionImagePool.length];
  const keyword = designKeywords[i % designKeywords.length];
  const description = descriptionDetails[i % descriptionDetails.length];
  
  fashionPins.push({
    title: `${keyword} Idea #${i}`,
    pin: `${description} Add this stylish concept directly to your mood board for ultimate outfit catalog inspiration.`,
    image: { 
      id: `seed-fashion-image-${i}`, 
      url: `https://images.unsplash.com/${imageId}?w=600` 
    },
    owner: secondaryUserId,
    saves: [],
    comments: [],
  });
}

async function seedDatabase() {
  if (secondaryUserId === "PASTE_NEW_USER_ID_HERE") {
    console.error("❌ Please paste your second MongoDB user ID into the secondaryUserId variable!");
    process.exit(1);
  }

  console.log("🔌 Connecting to database...");
  await connectDB();

  // This cleans out any past loop fashion entries so it doesn't double-stack if you run it twice,
  // but your first 54 standard pins stay 100% safe!
  console.log("🗑️ Cleaning out older loop fashion data if it exists...");
  await Pin.deleteMany({ "image.id": { $regex: "^seed-fashion-image-" } });

  console.log("🌱 Injecting 100 premium Fashion & Clothing pins into your feed...");
  
  const preparedPins = fashionPins.map(pin => ({
    ...pin,
    owner: new mongoose.Types.ObjectId(secondaryUserId)
  }));

  await Pin.insertMany(preparedPins);

  console.log(`✅ Successfully uploaded 100 beautiful fashion pins under User ID: ${secondaryUserId}!`);
  await mongoose.disconnect();
  console.log("🔌 Database disconnected. Seed complete!");
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});