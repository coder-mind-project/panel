import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { setUser as defineUser } from '@/redux/user/userActions';
import { setMenu as defineMenu } from '@/redux/menu/menuActions';
import { bindActionCreators } from 'redux';

import { useHistory } from 'react-router-dom';

import Drawer from './Drawer';
import AppBar from './AppBar';
import AppBarMobile from './AppBarMobile';

import { MenuRoot } from './styles';

function Menu(props) {
  const { menu, setMenu, setUser } = props;

  const history = useHistory();

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
    setMenu(false);
    history.push('/auth');
  }

  return (
    <MenuRoot display={menu ? 'true' : ''}>
      { menu && <AppBar logout={logout} /> }
      <Drawer logout={logout} />
      <AppBarMobile />
    </MenuRoot>
  );
}

Menu.propTypes = {
  menu: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ menu: state.menu });
const mapDispatchToProps = (dispatch) => bindActionCreators({
  setUser: defineUser,
  setMenu: defineMenu,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
