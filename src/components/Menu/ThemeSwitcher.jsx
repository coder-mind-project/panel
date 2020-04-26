import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toogleTheme as changeTheme } from '@/redux/theme/themeActions';

import { Switch, Icon } from '@material-ui/core';
import { appTheme } from '@/types';

import { ThemeSwitcherContainer } from './styles';

function ThemeSwitcher(props) {
  const {
    theme,
    toogleTheme,
  } = props;

  function swapTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('coder-mind-app-theme', JSON.stringify({ type: newTheme }));
    toogleTheme(newTheme);
  }

  return (
    <ThemeSwitcherContainer component="section">
      <Icon
        fontSize="small"
        color="action"
      >
        {theme === 'dark' ? 'brightness_low' : 'brightness_medium'}
      </Icon>
      <Switch
        onClick={swapTheme}
        checked={theme === 'dark'}
        color="primary"
        size="small"
      />
    </ThemeSwitcherContainer>
  );
}

ThemeSwitcher.propTypes = {
  theme: appTheme.isRequired,
  toogleTheme: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ toogleTheme: changeTheme }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher);
