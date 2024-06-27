const fs = require('fs');
const path = require('path');
const coursesData = require("../courses.json");

module.exports = async (req, res) => {
  const { course_id, identity_id } = req.body;
  console.log(`course_id :  ${course_id}, identity_id : ${identity_id}`);  
  // Check if course_id and identity_id are provided
  if (!course_id || !identity_id) {
    return res.status(400).json({ error: 'Both course_id and identity_id are required.' });
  }
  console.log("fs.readFile before");  
  const fileName = `${course_id}.json`;
  const filePath = path.join(__dirname, '..', 'data', fileName);
  fs.readFile(filePath, 'utf8', (err, data) => {
    console.log("fs.readFile worked");  
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const jsonData = JSON.parse(data);
        const currentDate = getCurrentDateFormatted();
        const currentWeek = getCurrentWeek(jsonData.header, jsonData.header.week16.split(' - ')[1],currentDate);
        console.log(`currentWeek :  ${currentWeek}`);      
        updateWeekValue(jsonData, identity_id, currentWeek);
        // Write the updated JSON data back to the file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('File updated successfully');
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
  });

  // Here you can perform operations like enrolling the identity in the course
  // For now, let's just send back a success response
  res.json({ success: true, message: `Checked ${identity_id} in course ${course_id}.` });
};

function getCurrentDateFormatted() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
  const year = currentDate.getFullYear();

  // Pad day and month with leading zeros if needed
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Format the date as "DD/MM/YYYY"
  const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
  return formattedDate;
}

// Function to convert date string to Date object
function toDate(dateString) {
  console.log(`dateString :  ${dateString}`);     
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}

// Function to get the current week based on start and end dates
function getCurrentWeek(jsonData, endDate, currentDate) {
  const start = toDate(jsonData.startDate);
  const end = toDate(endDate);
  const current = toDate(currentDate);
  if (current >= start && current <= end) {
      for (let i = 1; i <= 16; i++) {
          const week = jsonData[`week${i}`];
          const [weekStart, weekEnd] = week.split(' - ');
          const weekStartDate = toDate(weekStart);
          const weekEndDate = toDate(weekEnd);
          if (current >= weekStartDate && current <= weekEndDate) {
              return `week${i}`;
          }
      }
  }
  return null;
}

// Function to update the week value in the JSON data
function updateWeekValue(jsonData, identityId, currentWeek) {
  const data = jsonData.data;
  // console.log(`identityId ${identityId} data ${JSON.stringify(data)}`)
  const identity = data.find(item => item.identity_id === identityId);
  console.log(`identity ${JSON.stringify(identity)}`)
  if (identity) {
      const weekKey = `${currentWeek}`;
      if (identity.hasOwnProperty(weekKey)) {
          identity[weekKey] = 1; // Set week value to 1
          console.log(`Updated week ${currentWeek} for identity ${identityId}`);
      } else {
          console.log(`Week ${currentWeek} not found for identity ${identityId}`);
      }
  } else {
      console.log(`Identity ${identityId} not found`);
  }
}

// Read the content of 1.json file

