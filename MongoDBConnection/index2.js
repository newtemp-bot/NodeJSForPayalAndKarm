/**
 * 
 * Defualt Way to connect NodeJS is mongodb.
 * npm i mongodb
 * 
 */
const {MongoClient} = require('mongodb');
const url = "mongodb://localhost:27017/";
const dbname = "bascom";
const client = new MongoClient(url);

let data = {
    name:"Pooja Prajapati",
}

const main = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        let db = await client.db(dbname);
        console.log(`Database created or switched: ${db.databaseName}`);

        let collection = await db.collection('students');
        console.log(`Collection created: ${collection.collectionName}`);

        /* let result = await collection.insertOne(data,{ timestamps: true });
        console.log(result); */

    } catch (error) {
        console.error("Error:", err);
    }
    finally
    {
        await client.close();
        console.log("Connection closed.");
    }
}

main();