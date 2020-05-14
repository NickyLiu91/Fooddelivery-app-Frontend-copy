import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';

function ConfirmLeaving({ active, message }) {
  const handleOnBeforeUnload = e => {
    e.returnValue = message;
    return message;
  };
  useEffect(() => () => { window.onbeforeunload = null; }, []);

  window.onbeforeunload = active ? handleOnBeforeUnload : null;

  return (
    <Prompt
      when={active}
      message={message}
    />
  );
}

ConfirmLeaving.propTypes = {
  active: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

ConfirmLeaving.defaultProps = {
  message: "Are you sure? You've got unsaved changes",
};

export default ConfirmLeaving;

