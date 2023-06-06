const { DateTime } = require('luxon');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const json2csv = require('json2csv');

const { parseDescription, getTasks } = require('./utils');
const {
  PROJECTS_LOGS_PATH, STANDUP_NOTES_PATH, STANDUP_NOTES_FILE, TEAMS, EMAIL,
} = require('./config');

const files = fs.readdirSync(PROJECTS_LOGS_PATH);
const csvFiles = files.filter((file) => file.endsWith('.csv'));
let abc = [];
csvFiles.forEach((file) => {
  const filePath = `${PROJECTS_LOGS_PATH}${file}`;
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const records = parse(data, { columns: true, skip_empty_lines: true });
    const filterRecords = records.filter((record) => TEAMS.includes(record.Team));
    const notes = filterRecords.map((record, index) => {
      const filteredPrevItem = filterRecords[index - 1];

      const date = DateTime.fromJSDate(new Date(record.Date));

      if (filteredPrevItem) {
        const description = parseDescription(filteredPrevItem.Description);
        const todayTasks = getTasks(description.join(' '));

        return {
          Timestamp: date.toFormat('MM/dd/yy hh:mm:ss'),
          'Email Address': EMAIL,
          Date: date.toFormat('MM/dd/yy'),
          Today:
            todayTasks.length > 0
              ? `will continue work on ${todayTasks.join(', ')}`
              : 'will continue work on assigned tasks',
          Yesterday: description.join('\n'),
          Blockers: '',
        };
      }
      const description = parseDescription(record.Description);
      const tasks = getTasks(description.join(' '));
      return {
        Timestamp: date.toFormat('MM/dd/yy hh:mm:ss'),
        'Email Address': EMAIL,
        Date: date.toFormat('MM/dd/yy'),
        Today:
          tasks.length > 0
            ? `will continue work on ${tasks.join(', ')}`
            : 'will continue work on assigned tasks',
        Yesterday: description.join('\n'),
        Blockers: '',
      };
    });
    abc = [...abc, ...notes];
  } catch (error) {
    console.log(new Error(error).message);
  }
  // fs.readFileSync(filePath, 'utf8', async (err, data) => {
  //   if (err) throw err;

  //   // fs.rmSync(filePath);
  // });
});
if (abc.length > 0) {
  const csv = json2csv.parse(abc);
  const file = `${STANDUP_NOTES_PATH}${STANDUP_NOTES_FILE}`;
  fs.open(file, 'w', (e) => {
    if (e) throw e;
    fs.writeFile(file, csv, (error) => {
      if (error) throw error;
      console.log('Saved!');
    });
  });
}
