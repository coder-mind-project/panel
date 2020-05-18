import React from 'react';
import PropTypes from 'prop-types';

import { SettingsContainer } from './styles';

import SettingsDialogContentHeader from './SettingsDialogContentHeader';

function SettingsDialogAppearance(props) {
  const {
    open,
  } = props;

  return (
    <SettingsContainer open={open}>
      <SettingsDialogContentHeader icon="style" title="Aparência" />
      Content
    </SettingsContainer>
  );
}

SettingsDialogAppearance.propTypes = {
  open: PropTypes.bool,
};

SettingsDialogAppearance.defaultProps = {
  open: false,
};

export default SettingsDialogAppearance;
