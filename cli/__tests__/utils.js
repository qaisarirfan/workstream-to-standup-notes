const { getTasks, parseDescription } = require('../utils');

describe('getTasks', () => {
  it('returns an empty array when there are no tasks in the description', () => {
    const description = 'This is a simple description.';
    const expected = [];
    const result = getTasks(description);
    expect(result).toEqual(expected);
  });

  it('returns an array of tasks when there are tasks in the description', () => {
    const description = 'The following tasks are pending: MOPD-1234, EMPD-5678.';
    const expected = ['MOPD-1234', 'EMPD-5678'];
    const result = getTasks(description);
    expect(result).toEqual(expected);
  });

  it('returns an array of tasks when there is only one task in the description', () => {
    const description = 'The task to be completed is EMPD-9012.';
    const expected = ['EMPD-9012'];
    const result = getTasks(description);
    expect(result).toEqual(expected);
  });
});

describe('parseDescription', () => {
  it('removes task markers from the description', () => {
    const description = '[x] - Finish task 1\n[ ] - Finish task 2\n';
    const expected = ['Finish task 1', 'Finish task 2'];
    const result = parseDescription(description);
    expect(result).toEqual(expected);
  });

  it('removes numbers in parentheses from the description', () => {
    const description = 'This is a (1.1) numbered item.\nThis is a (2) numbered item.\n';
    const expected = ['This is a numbered item.', 'This is a numbered item.'];
    const result = parseDescription(description);
    expect(result).toEqual(expected);
  });

  it('returns an array of trimmed lines from the description', () => {
    const description = '  This is the first line.  \n  This is the second line.  \n';
    const expected = ['This is the first line.', 'This is the second line.'];
    const result = parseDescription(description);
    expect(result).toEqual(expected);
  });

  it('returns an empty array when the description is empty', () => {
    const description = '';
    const expected = [];
    const result = parseDescription(description);
    expect(result).toEqual(expected);
  });
});
