import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Drawer from './Drawer';
import AppBar from './AppBar';
import AppBarMobile from './AppBarMobile';

import { MenuRoot } from './styles';


function Menu(props) {
  const { menu } = props;

  function logout() {
    localStorage.removeItem('user');
    window.open('/auth', '_self');
  }

  return (
    <MenuRoot display={menu ? 'true' : ''}>
      <AppBar logout={logout} />
      <Drawer logout={logout} />
      <AppBarMobile />
    </MenuRoot>
  );
}

Menu.propTypes = {
  menu: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({ menu: state.menu });
export default connect(mapStateToProps)(Menu);
