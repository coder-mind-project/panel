import React from 'react';
import PropTypes from 'prop-types';

import {
  Drawer,
  Box,
  IconButton,
  Icon,
  Divider,
  useMediaQuery,
} from '@material-ui/core';
import { devices } from '@/config/devices';

function ArticleSettings(props) {
  const {
    open,
    close,
  } = props;

  const matches = useMediaQuery(devices.mobileExtraLarge);

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      PaperProps={{ style: { width: matches ? '100%' : '45%' } }}
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Box width="100%">
          <Box width="100%" display="flex" justifyContent="flex-end" alignItems="center">
            <IconButton onClick={close}>
              <Icon>
                clear
              </Icon>
            </IconButton>
          </Box>
          <Divider />
        </Box>
      </Box>
      <Box>
        article settings
      </Box>
    </Drawer>
  );
}

ArticleSettings.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
};

ArticleSettings.defaultProps = {
  open: false,
};

export default ArticleSettings;
