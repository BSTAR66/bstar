const fs = require('fs');
const path = require('path');
const coursesData = require("../courses.json");

module.exports = (req, res) => {
  const { name, course_id, section } = req.body;

  // Check if the file already exists
  const fileName = `${course_id}.json`;
  const filePath = path.join(__dirname, '..', 'data', fileName);
  if (fs.existsSync(filePath)) {
    // File already exists, render the home page with the 'fileExists' flag set to true
    return res.render("home", {
      userData: req.session.userId,
      courseData: coursesData,
      fileExists: true
    });
  }

  const newCourse = { id: course_id, name, section };
  coursesData.push(newCourse);

  // Write the new course data to a JSON file
  fs.writeFileSync(filePath, JSON.stringify([]));

  // Optionally, update the courses.json file as well
  fs.writeFileSync("courses.json", JSON.stringify(coursesData, null, 2));

  // Render the home page with updated course data and the 'fileExists' flag set to false
  res.render("home", {
    userData: req.session.userId,
    courseData: coursesData,
    fileExists: false
  });
};
