import React from 'react';
import PropTypes from 'prop-types';
import {
  ExpansionPanelSummary,
  Grid,
  Box,
  Icon,
  Typography,
} from '@material-ui/core';

import {
  CustomDivider,
  CustomIcon,
} from './styles';

function CustomPanelSummary(props) {
  const {
    expanded,
    icon,
    iconSize,
    title,
    description,
    expandIcon,
  } = props;

  return (
    <ExpansionPanelSummary
      expandIcon={(
        <Icon>
          {expandIcon}
        </Icon>
      )}
    >
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mb={1}>
            <CustomIcon color="action" fontSize={iconSize}>
              {icon}
            </CustomIcon>
            <Typography component="h2" variant="h6">
              {title}
            </Typography>
          </Box>
          <Typography component="h3" variant="caption">
            {description}
          </Typography>
        </Grid>
        {expanded
          && (
            <CustomDivider />
          )
        }
      </Grid>
    </ExpansionPanelSummary>
  );
}

CustomPanelSummary.propTypes = {
  expanded: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.oneOf([
    'inherit',
    'default',
    'small',
    'large',
  ]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  expandIcon: PropTypes.string,
};

CustomPanelSummary.defaultProps = {
  expanded: false,
  icon: '',
  iconSize: 'default',
  description: '',
  expandIcon: 'expand_more',
};

export default CustomPanelSummary;
