import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Divider,
} from '@material-ui/core';

import { connect } from 'react-redux';

import { scrollToTop } from '../../config/ScrollToTop';

import Header from '../Header';
import ShortcutSection from './ShortcutSection';
import ThemesAndCategories from './ThemesAndCategories';
import SchedulerDefinitions from './SchedulerDefinitions';
import Settings from './Settings';
import FloatingButton from '../FloatingButton';

function Management(props) {
  const { user } = { ...props };

  const [hideHelp, setHideHelp] = useState(false);

  function closeHideHelp() {
    const payload = { hideHelp: true };
    localStorage.setItem('management-help', JSON.stringify(payload));
    setHideHelp(true);
  }

  useEffect(() => {
    function getManagementConfig() {
      const payload = JSON.parse(localStorage.getItem('management-help'));
      if (payload) setHideHelp(payload.hideHelp);
    }

    if (!hideHelp) getManagementConfig();
  }, [hideHelp]);

  return (
    <Container id="component">
      <FloatingButton icon="keyboard_arrow_up" action={scrollToTop} />
      <Header
        title="Configurações"
        description="Configure propriedades da aplicação: como temas e categorias de artigos, Sincronizador e outras configurações"
        icon="settings"
      />
      { user && user.tagAdmin && !hideHelp
        && <ShortcutSection closeHideHelp={closeHideHelp} />
      }
      <ThemesAndCategories user={user} />
      { user && user.tagAdmin
        && <SchedulerDefinitions />
      }
      { user.tagAdmin && <Grid item xs={12}><Divider /></Grid>}

      { user && user.tagAdmin
        && <Settings />
      }
    </Container>
  );
}

const mapStateToProps = (state) => ({ user: state.user });


export default connect(mapStateToProps)(Management);
