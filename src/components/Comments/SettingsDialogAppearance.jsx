import React from 'react';

import {
  Box,
} from '@material-ui/core';

import SettingsDialogContentHeader from './SettingsDialogContentHeader';

function SettingsDialogAppearance() {
  return (
    <Box>
      <SettingsDialogContentHeader icon="style" title="Aparência" />
      Content
    </Box>
  );
}

export default SettingsDialogAppearance;
