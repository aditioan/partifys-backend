import express from "express";
import bodyParser from "body-parser";
import index from "./routes/index";
import path from "path";
import fs from "file-system";
import dotenv from "dotenv";
import mongoose from "mongoose";
const cors = require("cors");
const passport = require("passport");
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Setup Express
const app = express();
const port = process.env.PORT || 8080;
const room = require("./routes/api/v1/room");
app.use(cors());
// Setup body-parser
app.use(bodyParser.json({ extended: false }));

//connect to mongodb
mongoose
  .connect(
    process.env.MONGODB_URI,
    { useUnifiedTopology: true },
    function () {
      console.log("Connection has been made");
    }
  )
  .catch((err) => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

// Setup our routes. These will be served as first priority.
// Any request to /api will go through these routes.
app.use("/", index);
app.use("/room", room);

// fs.readdirSync('routes'+process.env.EXPRESS_API_VERSION).forEach(function (file) {
//     if(file.substr(-3) == '.js') {
//         const route = require('./routes'+ process.env.EXPRESS_API_VERSION + '/' + file)
//         route.controller(app)
//     }
// })

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, "public")));

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, () => console.log(`App server listening on port ${port}!`));
