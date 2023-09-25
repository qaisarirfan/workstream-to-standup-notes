import { DateTime } from 'luxon';
import papaparse from 'papaparse';

import { REGEX_FOR_TAG, REGEX_FOR_TASK, REGEX_FOR_TIME } from './constants';

export const regexParser = (input) => {
  // Validate input
  if (typeof input !== 'string') {
    throw new Error('Invalid input. Input must be a string');
  }

  // Parse input
  const m = input.match(/(\/?)(.+)\1([a-z]*)/i);

  // Invalid flags
  if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) {
    return RegExp(input);
  }

  // Create the regular expression
  return new RegExp(m[2], m[3]);
};

export const parseDescription = (description) => (description.length > 0
  ? description
    .trim()
    .replace(REGEX_FOR_TAG, '')
    .replace(REGEX_FOR_TIME, '')
    .split(/\n/gm)
    .map((val) => val.trim().replace(/\s+/g, ' '))
  : []);

export const parseDescriptionWH = (description) => (description.length > 0
  ? description
    .trim()
    .replace(/\r|\n/gm, ', ')
    .replace(/\s+/gm, ' ')
    .split('[')
    .join('\n[')
  : []);

export const getTasks = (regex, description) => {
  const newRegex = regexParser(regex || String(REGEX_FOR_TASK));
  const tasks = [];
  let x;
  // eslint-disable-next-line no-cond-assign
  while ((x = newRegex.exec(description))) {
    tasks.push(x[0]);
  }
  return tasks;
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

export const parseProjectsLogToStandupNotes = (records, data) => {
  let parseData = [];
  const filterRecords = data?.teams?.length > 0
    ? records.data.filter((record) => data?.teams?.includes(record.Team)) : records.data;
  const notes = filterRecords.map((record, index) => {
    const filteredPrevItem = filterRecords[index - 1];

    const date = DateTime.fromJSDate(new Date(record.Date));

    if (filteredPrevItem) {
      const description = parseDescription(filteredPrevItem.Description);
      const todayTasks = getTasks(data?.task_regex, description.join(' '));

      return {
        Timestamp: date.toFormat('MM/dd/yy hh:mm:ss'),
        'Email Address': data?.email,
        Date: date.toFormat('MM/dd/yy'),
        Today: todayTasks.length > 0
          ? `will continue work on ${todayTasks.join(', ')}`
          : 'will continue work on assigned tasks',
        Yesterday: description.join('\n'),
        Blockers: '',
      };
    }
    const description = parseDescription(record.Description);
    const tasks = getTasks(data.task_regex, description.join(' '));
    return {
      Timestamp: date.toFormat('MM/dd/yy hh:mm:ss'),
      'Email Address': data?.email,
      Date: date.toFormat('MM/dd/yy'),
      Today: tasks.length > 0
        ? `will continue work on ${tasks.join(', ')}`
        : 'will continue work on assigned tasks',
      Yesterday: description.join('\n'),
      Blockers: '',
    };
  });
  parseData = [...parseData, ...notes];
  if (parseData.length > 0) {
    return {
      json: parseData,
      csv: papaparse.unparse(parseData),
    };
  }
  return {
    join: [],
    csv: '',
  };
};

export const parseProjectsLogToStandupNotesWH = (records, data) => {
  let parseData = [];
  const filterRecords = data?.teams?.length > 0
    ? records.data.filter((record) => !data?.teams?.includes(record.Team)) : records.data;
  const notes = filterRecords.map((record, index) => {
    const filteredItem = filterRecords[index];
    const date = DateTime.fromJSDate(new Date(record.Date)).toFormat('dd/MM/yy');

    if (filteredItem) {
      const description = parseDescriptionWH(filteredItem.Description);
      return {
        Date: date,
        Description: description,
      };
    }
    const description = parseDescriptionWH(record.Description);
    return {
      Date: date,
      Description: description,
    };
  });
  parseData = [...parseData, ...notes];
  if (parseData.length > 0) {
    return {
      json: parseData,
      csv: papaparse.unparse(parseData),
    };
  }
  return {
    join: [],
    csv: '',
  };
};

export function downloadCSV(data) {
  let csv = data;
  const link = document.createElement('a');
  if (csv == null) return;

  const filename = 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
}
