/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import clsx from 'clsx';
import papaparse from 'papaparse';
import PropsTypes from 'prop-types';

import Button from '../Button';

import { copyToClipboard, downloadCSV, parseProjectsLogToStandupNotes } from '../../utils';

function Header({
  data, onDrawerOpen, jsonData, csvData,
}) {
  const [hasCopyAsJSON, setHasCopyAsJSON] = useState(false);
  const [isCopyAsJSON, setIsCopyAsJSON] = useState(false);
  const [hasCopyAsCSV, setHasCopyAsCSV] = useState(false);
  const [isCopyAsCSV, setIsCopyAsCSV] = useState(false);
  const [json, setJson] = jsonData;
  const [csv, setCsv] = csvData;

  const onCopyAsCSVHandler = async () => {
    setHasCopyAsJSON(false);
    setHasCopyAsCSV(false);
    setIsCopyAsCSV(true);
    try {
      await copyToClipboard(csv);
      setIsCopyAsCSV(false);
      setHasCopyAsCSV(true);
    } catch (error) {
      setIsCopyAsCSV(false);
      setHasCopyAsCSV(false);
    }
  };

  const onCopyAsJSONHandler = async () => {
    setHasCopyAsCSV(false);
    setIsCopyAsJSON(true);
    setHasCopyAsJSON(false);
    try {
      const text = JSON.stringify(json);
      await copyToClipboard(text);
      setIsCopyAsJSON(false);
      setHasCopyAsJSON(true);
    } catch (error) {
      setIsCopyAsJSON(false);
      setHasCopyAsJSON(false);
    }
  };

  const onChangeHandler = useCallback(
    ({ target: { files } }) => {
      const fileReader = new FileReader();
      fileReader.readAsText(files[0], 'UTF-8');
      fileReader.onload = ({ target: { result } }) => {
        const records = papaparse.parse(result, { header: true, skipEmptyLines: true });
        const parsedData = parseProjectsLogToStandupNotes(records, data);
        setCsv(parsedData.csv);
        setJson(parsedData.json);
      };
    },
    [data],
  );

  return (
    <div className="shadow-sm p-4 border-b flex justify-between items-center h-20">
      <form className="flex items-center space-x-6">
        <label className="block" htmlFor="input">
          <span className="sr-only">Choose</span>
          <input
            className={clsx(
              'block',
              'w-full',
              'text-sm',
              'text-indigo-500',
              'file:mr-4',
              'file:py-2',
              'file:px-4',
              'file:rounded-full',
              'file:border-0',
              'file:text-sm',
              'file:font-semibold',
              'file:bg-indigo-50',
              'file:text-indigo-700',
              'hover:file:bg-indigo-100',
              'cursor-pointer',
            )}
            id="input"
            onChange={onChangeHandler}
            type="file"
          />
        </label>
      </form>
      <div className="flex items-center">
        <Button onClick={() => downloadCSV(csv)} text="Download CSV" disabled={csv.length < 1} />
        <Button
          onClick={onCopyAsCSVHandler}
          disabled={csv.length < 1}
          text={`${hasCopyAsCSV ? 'Copied' : 'Copy'} as CSV`}
          classes={clsx({ 'bg-green-500': isCopyAsJSON })}
        />
        <Button
          onClick={onCopyAsJSONHandler}
          disabled={csv.length < 1}
          text={`${hasCopyAsJSON ? 'Copied' : 'Copy'} as JSON`}
          classes={clsx({ 'bg-green-500': isCopyAsJSON })}
        />
        <button type="button" onClick={onDrawerOpen} className="rounded-full bg-indigo-50  p-1">
          <AiFillSetting className="w-6 h-6 fill-indigo-700" />
        </button>
      </div>
    </div>
  );
}
Header.propTypes = {
  csvData: PropsTypes.shape([PropsTypes.string, PropsTypes.func]).isRequired,
  data: PropsTypes.shape().isRequired,
  jsonData: PropsTypes.shape([PropsTypes.arrayOf({}), PropsTypes.func]).isRequired,
  onDrawerOpen: PropsTypes.func,
};

Header.defaultProps = {
  onDrawerOpen: () => {},
};

export default Header;
