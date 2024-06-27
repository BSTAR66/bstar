const fs = require("fs");

module.exports = async (req, res) => {
  try {
    // Parse the query parameters from the request
    const { course_id, name, section } = req.query;

    // Construct the file name using the provided parameters
    const fileName = `${course_id}.json`;
    const filePath = `./data/${fileName}`;
    console.log("fileName : " + fileName + " filePath : " + filePath);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      console.log("File contents:", data);
      const jsonData = JSON.parse(data)
      console.log("Parsed JSON:", jsonData);
      res.json(jsonData.data);
    });
  } catch (error) {
    console.error("Error retrieving course details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
