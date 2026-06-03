import mongoose from "mongoose";

mongoose.connect("mongodb+srv://wedsiteprofile_db_user:cluster0@cluster0.n2rnox0.mongodb.net/?appName=Cluster0")
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("ERROR:", err.message);
        process.exit(1);
    });
