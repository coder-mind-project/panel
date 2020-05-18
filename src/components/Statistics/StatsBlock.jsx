import React from 'react';
import PropTypes from 'prop-types';
import { statType } from '@/types';

import {
  Box,
  Icon,
  Typography,
  CircularProgress,
} from '@material-ui/core';

import { displayFullDate } from '@/config/masks';

import { Block, BlockDataInfo } from './styles';

const StatsBlock = (props) => {
  const {
    data,
    loading,
    icon,
    title,
    loadingMsg,
  } = props;

  return (
    <Block>
      { !loading
        && (
          <Box height="100%" display="flex" flexDirection="column" justifyContent="space-between">
            <Box display="flex" width="100%">
              <Box margin="0 5px">
                <Icon fontSize="large" color="primary">
                  {icon}
                </Icon>
              </Box>
              <Box width="100%" display="flex" flexDirection="column" alignItems="flex-end">
                <Typography component="h4" variant="h6">
                  {title}
                </Typography>
                <Typography component="span" variant="caption">
                  Referente ao mês
                  {' '}
                  {data && data.month ? data.month : new Date().getMonth() + 1}
                </Typography>
              </Box>
            </Box>
            <BlockDataInfo>
              <Typography component="h1" variant="h4" color="primary">
                {data && data.count ? data.count : 0}
              </Typography>
            </BlockDataInfo>
            { data && data.generated_at && (
              <Box display="flex" justifyContent="center" alignItems="flex-end">
                <Typography component="span" variant="body2">
                  Ultima atualização em:
                  {' '}
                  {displayFullDate(data.generated_at)}
                </Typography>
              </Box>
            )}
          </Box>
        )
      }
      { loading
        && (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
            <Box mb={2}>
              <CircularProgress color="primary" size={50} />
            </Box>
            <Typography>
              {loadingMsg}
            </Typography>
          </Box>
        )
      }
    </Block>
  );
};

StatsBlock.propTypes = {
  data: statType.isRequired,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  loadingMsg: PropTypes.string,
};

StatsBlock.defaultProps = {
  loading: false,
  icon: '',
  loadingMsg: '',
};

export default StatsBlock;
