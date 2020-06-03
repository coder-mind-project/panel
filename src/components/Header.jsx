import React from 'react';
import { appTheme } from '@/types';
import PropTypes from 'prop-types';

import {
  Divider,
  Typography,
  Box,
} from '@material-ui/core';

import { connect } from 'react-redux';

import { CustomHeader, CustomIcon, CustomFaIcon } from './styles';

function Header(props) {
  const {
    icon,
    title,
    description,
    noMarginTop,
    fontAwesomeIcon,
    faIcon,
    theme,
  } = props;

  return (
    <CustomHeader
      container
      withoutmargin={noMarginTop ? 'true' : ''}
    >
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        mb={1}
      >
        { !fontAwesomeIcon
          && (
            <CustomIcon fontSize="large" theme={theme}>
              {icon}
            </CustomIcon>
          )
        }
        { fontAwesomeIcon
          && (
            <CustomFaIcon
              icon={faIcon}
              size="2x"
            />
          )
        }
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
      </Box>
      <Box width="100%">
        <Typography component="h2" variant="body2">
          {description}
        </Typography>
      </Box>
      <Box mt={1}>
        <Divider />
      </Box>
    </CustomHeader>
  );
}

Header.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  noMarginTop: PropTypes.bool,
  fontAwesomeIcon: PropTypes.bool,
  faIcon: PropTypes.string,
  theme: appTheme.isRequired,
};

Header.defaultProps = {
  icon: '',
  description: '',
  noMarginTop: false,
  fontAwesomeIcon: false,
  faIcon: '',
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(Header);
