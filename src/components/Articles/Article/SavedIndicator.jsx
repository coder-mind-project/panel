import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { usePrevious } from '@/hooks';

import { Box, Typography } from '@material-ui/core';

function SavedIndicator(props) {
  const {
    saving,
  } = props;

  const [label, setLabel] = useState('');
  const previousSaving = usePrevious(saving);

  useEffect(() => {
    if (saving) {
      setLabel('Salvando...');
    }

    if (!saving && previousSaving) {
      setLabel('Salvo');
    }

    const handler = setTimeout(() => {
      setLabel('');
    }, 1000);

    return () => clearTimeout(handler);
  }, [saving, label, previousSaving]);

  return (
    <Box marginX={3}>
      <Typography variant="caption" component="span" align="center">{label}</Typography>
    </Box>
  );
}

SavedIndicator.propTypes = {
  saving: PropTypes.bool,
};

SavedIndicator.defaultProps = {
  saving: false,
};

export default SavedIndicator;
