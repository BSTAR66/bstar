const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const flash = require("connect-flash");

const multer = require("multer");
const xlsx = require("xlsx");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const fs_promises = require("fs").promises;

//connectmongoDB
mongoose.connect(
  "mongodb+srv://12345:12345@cluster0.mqq2loe.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

global.loggedIn = null;

// Controllers
const indexController = require("./controllers/indexController");
const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const storeUserController = require("./controllers/storeUserController");
const loginUserController = require("./controllers/loginUserController");
const logoutController = require("./controllers/logoutController");
const homeController = require("./controllers/homeController");
const uploadController = require("./controllers/uploadController");
const courseAddController = require("./controllers/courseAddController");
const courseEditController = require("./controllers/courseEditController");
const courseDetailController = require("./controllers/courseDetailController");
const courseDeleteController = require("./controllers/courseDeleteController");
const checkNameController = require("./controllers/checkNameController");
// Middleware
const redirectIfAuth = require("./middleware/redirectIfAuth");
const authMiddleware = require("./middleware/authMiddleware");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(flash());
app.use(
  expressSession({
    secret: "node secret",
  })
);
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});
app.set("view engine", "ejs");

app.get("/", indexController);
app.get("/home", homeController);
app.get("/login", redirectIfAuth, loginController);
app.get("/register", redirectIfAuth, registerController);
app.post("/user/register", redirectIfAuth, storeUserController);
app.post("/user/login", redirectIfAuth, loginUserController);
app.get("/logout", logoutController);

app.get("/upload", (req, res) => {
  res.render("upload");
});
app.post("/upload", upload.single("file"), uploadController);

app.get("/course/detail", (req, res) => {
  res.render("course_detail");
});

app.post("/course/add", courseAddController);
app.post("/course/edit", courseEditController);
app.post("/course/delete", courseDeleteController);

app.post("/course/check", checkNameController);

app.get("/course/detail-data", courseDetailController);

app.post("/api/saveDataToFile", async (req, res) => {
  try {
    const { fileName, jsonData } = req.body;
    // Convert JSON data to a string
    const jsonString = JSON.stringify(jsonData, null, 2);
    const filePath = `./data/${fileName}`;
    // console.log("jsonString : " + jsonString + "filePath : " + filePath);

    // Write JSON data to the file
    await fs_promises.writeFile(filePath, jsonString);

    // Send a success response
    res.status(200).json({ message: "Data saved successfully." });
  } catch (error) {
    // Send an error response if something goes wrong
    console.error("Error occurred while saving data:", error);
    res.status(500).json({ error: "Failed to save data." });
  }
});

app.post('/api/check', checkNameController);

//app.listen(3000, () => {
  //console.log("App listening on port 3000");

  //app.listen(3000, () => {
    //console.log("App listening on port 3000");
    
    const PORT = 4000 // เปลี่ยนเป็นพอร์ตที่ไม่ถูกใช้งานอยู่แล้ว เช่น 4000, 8080, 8888 ฯลฯ

    app.listen(4000, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

