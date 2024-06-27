const multer = require("multer");
const xlsx = require("xlsx");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
// Function to format date as "dd/mm/yyyy"
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const { course_id, course_name, course_section } = req.body;

  // Read the uploaded XLSX file
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const columnMapping = {
    B: "row_id",
    C: "identity_id",
    D: "name_lastname",
    F: "department",
    I: "week1",
    J: "week2",
    K: "week3",
    L: "week4",
    M: "week5",
    N: "week6",
    O: "week7",
    P: "week8",
    Q: "week9",
    R: "week10",
    S: "week11",
    T: "week12",
    U: "week13",
    V: "week14",
    W: "week15",
    X: "week16",
    Y: "week17",
    Z: "week18",
    AA: "week19",
  };
  const atdrecData = {};
  const headerData = {};
  const data = xlsx.utils
    .sheet_to_json(sheet, { header: "A", defval: 0 })
    .map((row) => {
      // console.log(row);
      const filteredRow = {};
      for (const key in columnMapping) {
        if (columnMapping.hasOwnProperty(key)) {
          if (key === "B") {
            if (typeof row[key] === 'string' && row[key].startsWith('วันที่เริ่มเรียน ')) {
              const datePart = row[key].split(" ")[1];
              // row["startDate"] = datePart;
              headerData["startDate"] = datePart;
              console.log("headerData[startDate] : " + headerData["startDate"]);
              return null;
            }
            if (
              row[key] !== undefined &&
              !isNaN(parseFloat(row[key])) &&
              parseFloat(row[key]) != 0
            ) {
              filteredRow[columnMapping[key]] = parseFloat(row[key]);
            } else {
              return null;
            }
          } else {
            filteredRow[columnMapping[key]] =
              row[key] !== undefined ? row[key] : 0;
          }
        }
      }
      return filteredRow;
    });
  atdrecData["header"] = headerData;
  atdrecData["data"] = data;
  const filteredData = atdrecData.data.filter(item => item !== null);
  atdrecData["data"] = filteredData;
  // console.log(atdrecData);

  // Convert the provided start date string to a JavaScript Date object
  const startDateString = headerData['startDate'];
  const [day, month, year] = startDateString.split('/').map(Number);
  const startDate = new Date(year, month - 1, day); // Month is zero-based

  // Initialize an array to store the week start and end dates
  // const weekDates = [];

  // Loop through each week for 16 weeks
  for (let i = 0; i < 16; i++) {
      // Calculate the date for each week
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i * 7);

      // Find the start date of the week
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Assuming Monday is the start of the week
      const formattedStartOfWeek = formatDate(startOfWeek);

      // Find the end date of the week
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Assuming Sunday is the end of the week
      const formattedEndOfWeek = formatDate(endOfWeek);

      // Construct the key in the format "weekX"
      const weekKey = `week${i + 1}`;

      // Assign the start and end dates to the corresponding key
      headerData[weekKey] = `${formattedStartOfWeek} - ${formattedEndOfWeek}`;
  }

  // Output the array of week start and end dates
  console.log(headerData);
  res.render("pre_data", {
    mainData: atdrecData,
    courseData: { id: course_id, name: course_name, section: course_section },
  });
};




