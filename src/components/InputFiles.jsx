import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

function InputFiles(props) {
  const {
    children,
    onChange,
    name,
    accept,
  } = props;

  const input = useRef(null);

  function onClick(evt) {
    evt.preventDefault();

    const inputField = input.current;
    if (inputField) inputField.click();
  }

  return (
    <Box>
      <Box
        onClick={onClick}
        onKeyPress={onClick}
        role="button"
        tabIndex="0"
        style={{ display: 'inline-block' }}
      >
        {children}
      </Box>
      <input
        ref={input}
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

InputFiles.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  accept: PropTypes.string,
};

InputFiles.defaultProps = {
  name: '',
  accept: 'image/png, image/jpeg',
};

export default InputFiles;
