import React from 'react';
import { GrClose } from 'react-icons/gr';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import PropsTypes from 'prop-types';

import Button from '../Button';

function Drawer({
  isVisible, onClose, data, setData,
}) {
  const onInputChangeHandler = (field) => ({ target: { value } }) => {
    setData((state) => ({
      ...state,
      [field]: value,
    }));
  };

  const onTeamsInputChangeHandler = (field) => ({ target: { value } }) => {
    const teams = value?.split(',');
    setData((state) => ({
      ...state,
      [field]: teams,
    }));
  };

  const onSaveHandler = () => {
    localStorage.setItem('wsn', JSON.stringify(data));
    toast('Wow so easy!', {
      type: 'success', position: 'bottom-center', hideProgressBar: true,
    });
    onClose();
  };

  return (
    <div
      className={clsx(
        'absolute',
        'top-0',
        'right-0',
        'h-screen',
        'border-l',
        'bg-white',
        'shadow-lg',
        'w-96',
        'z-10',
        !isVisible && 'hidden',
      )}
    >
      <div className="shadow-sm p-4 border-b flex justify-between items-center h-20">
        <p>Setting</p>
        <button type="button" onClick={onClose}>
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
            value={data?.email}
          />
        </label>

        <label htmlFor="team" className="mb-4 block">
          <strong className="font-light">Team(s)</strong>
          <input
            className="block w-full focus:outline-none px-2 py-1 text-base rounded border shadow-sm"
            id="team"
            onChange={onTeamsInputChangeHandler('teams')}
            type="text"
            value={data?.teams?.join(',')}
          />
        </label>

        <label htmlFor="team" className="mb-4 block">
          <strong className="font-light">Tasks regex</strong>
          <input
            className="block w-full focus:outline-none px-2 py-1 text-base rounded border shadow-sm"
            id="team"
            onChange={onInputChangeHandler('task_regex')}
            type="text"
            value={data?.task_regex}
          />
        </label>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <Button
            onClick={onSaveHandler}
            text="Save"
          />
        </div>
      </div>
    </div>
  );
}

Drawer.propTypes = {
  isVisible: PropsTypes.bool,
  onClose: PropsTypes.func,
  data: PropsTypes.shape().isRequired,
  setData: PropsTypes.func,
};

Drawer.defaultProps = {
  isVisible: false,
  onClose: () => {},
  setData: () => {},
};

export default Drawer;
