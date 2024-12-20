const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://chat-app-git-main-maniacayus-projects.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight requests for complex CORS requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});
// const app = express()

console.log(process.env.FRONTEND_URL);
app.use(
  cors({
    origin : "https://chat-app-git-main-maniacayus-projects.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.options("*", cors({
  origin: "https://chat-app-git-main-maniacayus-projects.vercel.app",
  credentials: true,
}));


app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 8080;

app.get("/", (request, response) => {
  response.json({
    message: "Server running at " + PORT,
  });
});
connectDB().then(() => {
  server.listen(PORT, () => {
  });
});

//api endpoints
app.use("/api", router);
