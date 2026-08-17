 import { MongoClient } from "mongodb";

import "dotenv/config";



const uri = process.env.MONGODB_URI;



if (!uri) {

throw new Error("MONGODB_URI is not defined in .env");

}



const client = new MongoClient(uri);



let db;



const connectDB = async () => {

try {

if (db) {

return db;

}



// await client.connect();



db = client.db("drivefleet");



console.log("MongoDB connected successfully");



return db;

} catch (error) {

console.error("MongoDB connection failed:", error);

throw error;

}

};



export default connectDB; 

