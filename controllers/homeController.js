const User = require("../models/User");
const fs = require("fs/promises"); // Using promises version of fs

module.exports = async (req, res) => {
  try {
    // Fetch user data
    let userData = await User.findById(req.session.userId);

    // Read course data from courses.json
    let coursesData = await fs.readFile("courses.json", "utf-8");
    let courses = JSON.parse(coursesData);

    res.render("home", {
      userData: userData,
      courseData: courses,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};
