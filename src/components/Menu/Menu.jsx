import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Drawer from './Drawer';
import AppBar from './AppBar';

import { MenuRoot } from './styles';


function Menu(props) {
  const { menu } = props;
  const [showingDrawer, setShowingDrawer] = useState(false);

  function showDrawer() {
    setShowingDrawer(true);
  }

  function hideDrawer() {
    setShowingDrawer(false);
  }


  function logout() {
    localStorage.removeItem('user');
    window.open('/auth', '_self');
  }

  return (
    <MenuRoot display={menu ? 'true' : ''}>
      <AppBar displayDrawer={showDrawer} logout={logout} />
      <Drawer isOpen={showingDrawer} close={hideDrawer} logout={logout} />
    </MenuRoot>
  );
}

Menu.propTypes = {
  menu: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({ menu: state.menu });
export default connect(mapStateToProps)(Menu);
