import React from 'react';
import {
  Grid,
  Card,
  Divider,
  Box,
  Typography,
  IconButton,
  Icon,
  Tooltip,
  Grow,
} from '@material-ui/core';

import { CustomCardContent } from './styles';
import ShortcutOption from './ShortcutOption';

const ShortcutSection = (props) => {
  const { closeHideHelp } = { ...props };

  const colors = {
    themes: { left: '#EC6F66', right: '#cf635b' },
    sincronizer: { left: '#348AC7', right: '#2c7ab1' },
    users: { left: '#8E54E9', right: '#7b46d0' },
    tickets: { left: '#71B280', right: '#50905f' },
  };

  return (
    <Grow in>
      <Grid item xs={12}>
        <Card>
          <Box m={2} mb={0}>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" component="h2">
                Precisa de ajuda?
              </Typography>
              <Tooltip
                title={<Typography variant="body2" component="span">Fechar</Typography>}
                placement="left-start"
              >
                <IconButton onClick={closeHideHelp}>
                  <Icon>
                    clear
                  </Icon>
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" component="p">
              Selecione o que você precisa dentro de nossa sessão de configurações!
            </Typography>
          </Box>
          <CustomCardContent>
            <ShortcutOption icon="folder_open" title="Temas & categorias" idRef="themes" colorLeft={colors.themes.left} colorRight={colors.themes.right} />
            <ShortcutOption icon="autorenew" title="Agendador" idRef="sincronizer" colorLeft={colors.sincronizer.left} colorRight={colors.sincronizer.right} />
            <ShortcutOption icon="person" title="Usuários" idRef="users" colorLeft={colors.users.left} colorRight={colors.users.right} />
            <ShortcutOption icon="label" title="Tickets" idRef="tickets" colorLeft={colors.tickets.left} colorRight={colors.tickets.right} />
          </CustomCardContent>
        </Card>
        <Box width="100%" mt={2}><Divider /></Box>
      </Grid>
    </Grow>
  );
};

export default ShortcutSection;
