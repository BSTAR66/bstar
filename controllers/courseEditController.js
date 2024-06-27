
const fs_promises = require('fs').promises;
const coursesData = require("../courses.json");
module.exports = async (req, res) => {
  const { name, course_id, section } = req.body;
  console.log(req.body);
  const courseIndex = coursesData.findIndex((course) => course.id == course_id);
  console.log("courseIndex : " + courseIndex);
  if (courseIndex !== -1) {
    // Update the course details
    coursesData[courseIndex].name = name;
    coursesData[courseIndex].section = section;
    // Save the updated data to course.json
    await fs_promises.writeFile('courses.json', JSON.stringify(coursesData, null, 2));
    res.render("home", {
      userData: req.session.userId,
      courseData: coursesData,
    });
  } else {
    res.status(404).json({ success: false, message: 'Course not found' });
  }
};
