const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_CONN;

mongoose
    .connect("mongodb+srv://sakshamvashisht485:0zxTJXFZxIMm260q@invotrack.hfsd8.mongodb.net/")
    .then(() => {
        console.log("MongoDB Connected...");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error: ", err);
    });
