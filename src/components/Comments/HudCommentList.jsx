import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Tooltip,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@material-ui/core';

import { devices } from '@/config/devices';

import axios from 'axios';
import {
  backendUrl,
  defineErrorMsg,
  defineErrorType,
} from '@/config/backend';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import {
  error as toastError,
  info as toastInfo,
} from '@/config/toasts';

import {
  HudContainer,
  HudIconButton,
  HudSearchBar,
  HudSearchBarContainer,
  CustomIcon,
} from './styles';

function HudCommentList(props) {
  const {
    reload,
    markAllAsRead,
    changeOrder,
    changeType,
    callToast,
    searchComments,
    showSettings,
  } = props;

  const [query, setQuery] = useState('');
  const [anchorMenuOrder, setAnchorMenuOrder] = useState(null);
  const [anchorMenuType, setAnchorMenuType] = useState(null);
  const [anchorOptions, setAnchorOptions] = useState(null);
  const [order, setOrder] = useState('desc');
  const [type, setType] = useState('all');
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const matches = useMediaQuery(devices.tablet);

  function changeQueryValue(q = '') {
    setQuery(q);
    searchComments(q);
  }

  function handleOpenMenu(evt, option) {
    const { currentTarget } = evt;

    switch (option) {
      case 'order': {
        setAnchorMenuOrder(currentTarget);
        break;
      }
      case 'type': {
        setAnchorMenuType(currentTarget);
        break;
      }
      default: {
        setAnchorOptions(currentTarget);
      }
    }
  }

  function handleCloseMenu(option) {
    switch (option) {
      case 'order': {
        setAnchorMenuOrder(null);
        break;
      }
      case 'type': {
        setAnchorMenuType(null);
        break;
      }
      default: {
        setAnchorOptions(null);
      }
    }
  }

  function getTypes() {
    if (type === 'not-readed') return 'Não lidos';
    if (type === 'only-readed') return 'Somente lidos';

    return 'Todos';
  }

  function setTypes(t) {
    setType(t);
    changeType(t);
    handleCloseMenu('type');
  }

  function switchOrder(o, provider) {
    setOrder(o);
    changeOrder(o);
    handleCloseMenu(provider);
  }

  function confirmAllAsReaded(provider) {
    if (provider) {
      handleCloseMenu(provider);
    }

    markAllAsRead('all-readed');

    const url = `${backendUrl}/comments`;

    axios.patch(url).catch((error) => {
      const msg = defineErrorMsg(error);
      const errorType = defineErrorType(error);
      callToast(errorType === 'gone' ? toastInfo(msg) : toastError(msg));
      markAllAsRead('all-not-readed');
    });
  }

  function displaySettings(provider) {
    handleCloseMenu(provider);
    showSettings();
  }

  useEffect(() => {
    function getSettings() {
      const currentSettings = JSON.parse(localStorage.getItem('cm-comments-settings'));
      if (currentSettings) {
        setType(currentSettings.type);
        setOrder(currentSettings.order);
      }
    }

    if (!settingsLoaded) {
      setSettingsLoaded(true);
      getSettings();
    }
  }, [type, order, settingsLoaded]);

  return (
    <HudContainer>
      <Box
        display="flex"
        justifyContent={matches ? 'space-between' : 'flex-start'}
        alignItems="center"
        width={matches ? '100%' : 'auto'}
        mb={1}
      >
        <Box display="flex" alignItems="center" ml={0.5} mr={0.5}>
          <Typography component="span" variant="body2">
            Exibindo:
          </Typography>
          <Button
            onClick={(evt) => handleOpenMenu(evt, 'type')}
            size="small"
            color="inherit"
          >
            {getTypes()}
          </Button>
        </Box>
        <Menu
          anchorEl={anchorMenuType}
          keepMounted
          open={Boolean(anchorMenuType)}
          onClose={() => handleCloseMenu('type')}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => setTypes('all')}>Todos</MenuItem>
          <MenuItem onClick={() => setTypes('not-readed')}>Não lidos</MenuItem>
          <MenuItem onClick={() => setTypes('only-readed')}>Somente lidos</MenuItem>
        </Menu>
        { matches && (
          <Box>
            <HudIconButton onClick={(evt) => handleOpenMenu(evt, 'options')}>
              <CustomIcon>more_vert</CustomIcon>
            </HudIconButton>
            <Menu
              anchorEl={anchorOptions}
              open={Boolean(anchorOptions)}
              onClose={() => handleCloseMenu('options')}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => confirmAllAsReaded('options')}>
                Marcar todos como lido
              </MenuItem>
              <MenuItem onClick={() => switchOrder(order === 'asc' ? 'desc' : 'asc', 'options')}>
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1" component="p">
                    Trocar Ordenação
                  </Typography>
                  <Typography variant="caption" component="span">
                    Ordenação atual:
                    {' '}
                    {order === 'asc' ? 'Ascendente' : 'Descendente'}
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={() => displaySettings('options')}>
                Configurações
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
      <HudSearchBarContainer>
        { !matches
          && (
          <Box display="flex" alignItems="center">
            <Tooltip title={(
              <Typography
                component="span"
                variant="body2"
              >
                Ordem
              </Typography>
            )}
            >
              <HudIconButton onClick={(evt) => handleOpenMenu(evt, 'order')}>
                <CustomIcon>sort_by_alpha</CustomIcon>
              </HudIconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorMenuOrder}
              keepMounted
              open={Boolean(anchorMenuOrder)}
              onClose={() => handleCloseMenu('order')}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem selected={order === 'asc'} onClick={() => switchOrder('asc', 'order')}>
                <Typography>A-Z</Typography>
              </MenuItem>
              <MenuItem selected={order === 'desc'} onClick={() => switchOrder('desc', 'order')}>
                <Typography>Z-A</Typography>
              </MenuItem>
            </Menu>
            <Tooltip title={(
              <Typography
                component="span"
                variant="body2"
              >
                Atualizar
              </Typography>
            )}
            >
              <HudIconButton onClick={reload}>
                <CustomIcon>refresh</CustomIcon>
              </HudIconButton>
            </Tooltip>
            <Tooltip title={(
              <Typography
                component="span"
                variant="body2"
              >
                Marcar todos como lidos
              </Typography>
            )}
            >
              <Box>
                <HudIconButton searchtype={type} onClick={confirmAllAsReaded} disabled={type === 'only-readed'}>
                  <CustomIcon>done_all</CustomIcon>
                </HudIconButton>
              </Box>
            </Tooltip>
            <Tooltip title={(
              <Typography
                component="span"
                variant="body2"
              >
                Configurações
              </Typography>
            )}
            >
              <HudIconButton onClick={displaySettings}>
                <CustomIcon>settings</CustomIcon>
              </HudIconButton>
            </Tooltip>
          </Box>
          )}
        <HudSearchBar
          id="search_field"
          fullWidth
          placeholder="Pesquisar"
          value={query}
          onChange={changeQueryValue}
          onCancelSearch={changeQueryValue}
        />
      </HudSearchBarContainer>
    </HudContainer>
  );
}

HudCommentList.propTypes = {
  reload: PropTypes.func.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
  changeOrder: PropTypes.func.isRequired,
  changeType: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  searchComments: PropTypes.func.isRequired,
  showSettings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HudCommentList);
