const fs = require('fs').promises;
const path = require('path');
const coursesData = require("../courses.json");

module.exports = async (req, res) => {
  const { course_id_delete, name_delete, section_delete } = req.body;
  console.log(req.body);
  const courseIndex = coursesData.findIndex((course) => course.id == course_id_delete);
  if (courseIndex !== -1) {
    // Remove the course from the array
    coursesData.splice(courseIndex, 1);
    // Save the updated data to courses.json
    await fs.writeFile('courses.json', JSON.stringify(coursesData, null, 2));
    res.render("home", {
      userData: req.session.userId,
      courseData: coursesData,
    });

    // Construct the file name to be removed
    const fileName = `${course_id_delete}.json`;
    const filePath = `./data/${fileName}`;

    // Remove the file if it exists after updating the course
    try {
      await fs.unlink(filePath);
      console.log(`${fileName} has been removed`);
    } catch (error) {
      console.error(`Error removing ${fileName}:`, error);
    }
  } else {
    res.status(404).json({ success: false, message: 'Course not found' });
  }
};
