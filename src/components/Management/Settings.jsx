import React from 'react';

import {
  Grid,
  Box,
  Icon,
  CardContent,
  Typography,
  CardActions,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import Button from '../Button';

import { CustomGrid, CustomCard } from './styles';

function Settings() {
  return (
    <CustomGrid item xs={12}>
      <Box mb={3}>
        <Box width="100%" display="flex" alignItems="center">
          <Box mr={1}>
            <Icon>work_outline</Icon>
          </Box>
          <Typography variant="h6" component="h3">Gerenciamento</Typography>
        </Box>
        <Typography variant="body2" component="span">
          Gerencie usuários da plataforma,
          visualize e responda a tickets de atendimento aos autores da plataforma.
        </Typography>
      </Box>
      <Box width="100%" display="flex" flexWrap="wrap" alignItems="center">
        <Grid item xs={12} md={6}>
          <CustomCard>
            <CardContent>
              <Box id="users" display="flex" alignItems="center">
                <Box mr={1} display="flex" alignItems="center">
                  <Icon>
                    people
                  </Icon>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" component="h4">
                    Usuários
                  </Typography>
                </Box>
              </Box>
              <Typography component="p" variant="body2">
                Crie perfis para autores,
                administradores para acesso a plataforma.
                Usuários de tipos diferentes possui acesso a diferentes funcionalidades.
              </Typography>
            </CardContent>
            <CardActions>
              <Box width="100%" ml={2} mr={2}>
                <Link to="/users" className="linkRouter">
                  <Button
                    color="default"
                    icon="exit_to_app"
                    text="Acessar"
                  />
                </Link>
              </Box>
            </CardActions>
          </CustomCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomCard>
            <CardContent>
              <Box id="tickets" display="flex" alignItems="center">
                <Box mr={1} display="flex" alignItems="center">
                  <Icon>
                    email
                  </Icon>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" component="h4">
                    Tickets
                  </Typography>
                </Box>
              </Box>
              <Typography component="p" variant="body2">
                Visualize, responda, mantenha respostas e
                veja atividades relacionadas a tickets.
                Sendo o meio de comunicação entre os usuários e a Coder Mind.
              </Typography>
            </CardContent>
            <CardActions>
              <Box width="100%" ml={2} mr={2}>
                <Link to="/tickets" className="linkRouter">
                  <Button
                    color="default"
                    icon="exit_to_app"
                    text="Acessar"
                  />
                </Link>
              </Box>
            </CardActions>
          </CustomCard>
        </Grid>
      </Box>
    </CustomGrid>
  );
}

export default Settings;
