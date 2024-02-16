const mongoose = require("mongoose");
const sectionData = require("./data.js");
const Section = require("../models/section.js"); // Ensure you are importing the correct model

const MONGO_URL = "mongodb://127.0.0.1:27017/word_finder";

main()
    .then(() => {
        console.log("Connected to the database");
        initDB();
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        // Clear existing data
        // await Section.deleteMany({});

        // Insert new data
        await Section.insertMany(sectionData.data);
        console.log("Data was initialized");
    } catch (error) {
        console.error("Error initializing data:", error);
    } finally {
        // Close the database connection after data initialization
        await mongoose.connection.close();
    }
};
