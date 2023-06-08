import React from 'react';
import PropsTypes from 'prop-types';

function Button({
  onClick, disabled, text,
}) {
  const btnClasses = [
    'bg-indigo-600',
    'disabled:bg-gray-200',
    'disabled:shadow-none',
    'disabled:text-gray-400',
    'focus-visible:outline-2',
    'focus-visible:outline-indigo-600',
    'focus-visible:outline-offset-2',
    'focus-visible:outline',
    'font-semibold',
    'hover:bg-indigo-500',
    'me-4',
    'px-3',
    'py-2',
    'rounded-full',
    'shadow-sm',
    'text-sm',
    'text-white',
  ];

  return (
    <button
      className={`${btnClasses.join(' ')}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  disabled: PropsTypes.bool,
  onClick: PropsTypes.func,
  text: PropsTypes.string,
};

Button.defaultProps = {
  disabled: false,
  onClick: () => {},
  text: null,
};

export default Button;
