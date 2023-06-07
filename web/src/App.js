import React, { useCallback, useEffect, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { parse } from 'csv-parse';

const fileClasses = [
  'block',
  'w-full',
  'text-sm',
  'text-slate-500',
  'file:mr-4',
  'file:py-2',
  'file:px-4',
  'file:rounded-full',
  'file:border-0',
  'file:text-sm',
  'file:font-semibold',
  'file:bg-violet-50',
  'file:text-violet-700',
  'hover:file:bg-violet-100',
];

function App() {
  const [isSettingVisible, setSettingVisible] = useState(false);

  const [setting, setSetting] = useState({ email: '', teams: [], task_regex: '' });

  const onChangeHandler = useCallback(({ target: { files } }) => {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0], 'UTF-8');
    fileReader.onload = ({ target: { result } }) => {
      const records = parse(result, { columns: true, skip_empty_lines: true });

      console.log(records);

      // setFiles(e.target.result);
    };
  }, []);

  const onInputChangeHandler = (field) => ({ target: { value } }) => {
    setSetting((state) => ({
      ...state,
      [field]: value,
    }));
  };

  const onTeamsInputChangeHandler = (field) => ({ target: { value } }) => {
    const teams = value?.split(',');
    setSetting((state) => ({
      ...state,
      [field]: teams,
    }));
  };

  const onSaveHandler = () => {
    localStorage.setItem('wsn', JSON.stringify(setting));
  };

  useEffect(() => {
    const data = localStorage.getItem('wsn') || '{}';
    setSetting(JSON.parse(data));
  }, []);

  return (
    <div className="shadow-sm p-4 border-b flex justify-between items-center h-20">
      <form className="flex items-center space-x-6">
        <label className="block" htmlFor="input">
          <span className="sr-only">Choose profile photo</span>
          <input
            className={fileClasses.join(' ')}
            id="input"
            onChange={onChangeHandler}
            type="file"
          />
        </label>
      </form>
      <button type="button" onClick={() => setSettingVisible(true)}>
        <AiFillSetting className="w-6 h-6" />
      </button>
      <div className={`absolute top-0 right-0 h-screen border-l bg-white shadow-lg w-2/6 ${!isSettingVisible && 'hidden'}`}>
        <div className="shadow-sm p-4 border-b flex justify-between items-center h-20">
          <p>Setting</p>
          <button type="button" onClick={() => setSettingVisible(false)}>
            <GrClose className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <label htmlFor="team" className="mb-4 block">
            <strong className="font-light">Email</strong>
            <input
              className="block w-full focus:outline-none px-2 py-1 text-base rounded border shadow-sm"
              id="email"
              onChange={onInputChangeHandler('email')}
              type="email"
              value={setting.email}
            />
          </label>

          <label htmlFor="team" className="mb-4 block">
            <strong className="font-light">Team(s)</strong>
            <input
              className="block w-full focus:outline-none px-2 py-1 text-base rounded border shadow-sm"
              id="team"
              onChange={onTeamsInputChangeHandler('teams')}
              type="text"
              value={setting.teams}
            />
          </label>

          <label htmlFor="team" className="mb-4 block">
            <strong className="font-light">Tasks regex</strong>
            <input
              className="block w-full focus:outline-none px-2 py-1 text-base rounded border shadow-sm"
              id="team"
              onChange={onInputChangeHandler('task_regex')}
              type="text"
              value={setting.task_regex}
            />
          </label>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => setSettingVisible(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={onSaveHandler}
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
