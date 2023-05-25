const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://akshaybuster5280:lwr22ngfc6ZY70cf@cirrusnotes.cjayuai.mongodb.net/CirrusNotes?",
      {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

module.exports = connectToMongo;
