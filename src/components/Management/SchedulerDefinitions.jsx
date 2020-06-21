import React, { useState, useEffect } from 'react';

import {
  Box,
  Icon,
  Typography,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Button,
} from '@material-ui/core';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '../../redux/toast/toastActions';

import { displayFullDate } from '../../config/masks';

import { defineErrorMsg } from '../../config/backend';
import { success, error as toastError } from '../../config/toasts';

import { CustomGrid } from './styles';

function SchedulerDefinitions(props) {
  const { callToast } = { ...props };

  const [synchronizing, setSynchronizing] = useState(false);
  const [lastSynchronization, setLastSynchronization] = useState('');
  const [error, setError] = useState(false);

  async function sincronize() {
    if (synchronizing) return;
    setSynchronizing(true);

    const url = '/stats/synchronization';

    await axios.post(url).then((res) => {
      setLastSynchronization(displayFullDate(res.data.generatedAt));
      callToast(success('Sincronização realizada com sucesso'));
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });

    setSynchronizing(false);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getLastSynchronization() {
      try {
        const url = '/stats/synchronization';

        await axios(url, { cancelToken: source.token }).then((res) => {
          if (res.data && res.data.generatedAt) {
            const formatedDate = displayFullDate(res.data.generatedAt);
            setLastSynchronization(formatedDate);
          }
        });
      } catch (err) {
        if (!axios.isCancel(err)) {
          const msg = defineErrorMsg(err);
          setError(msg);
        }
      }
    }

    if (!lastSynchronization && !error) getLastSynchronization();

    return () => source.cancel();
  }, [lastSynchronization, error]);

  return (
    <CustomGrid item xs={12}>
      <Box id="sincronizer" width="100%" display="flex" alignItems="center">
        <Box mr={1}>
          <Icon>autorenew</Icon>
        </Box>
        <Typography variant="h6" component="h3">Definições de agendador</Typography>
      </Box>
      <Typography variant="body2" component="span">
        Este agendador é referênte a sincrozinação das bases de dados da aplicação,
        tenha certeza do que esteja fazendo ao utilizar desse recurso.
      </Typography>
      <Box mt={3} mb={3} display="flex" flexWrap="wrap" alignItems="center">
        <Card>
          {synchronizing
            && <LinearProgress color="primary" />
          }
          <CardContent>
            <Box display="flex" alignItems="center">
              <Box mr={1} display="flex" alignItems="center">
                <Icon>
                  bar_chart
                </Icon>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" component="h3">
                  Sincronizar estatísticas
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" component="p">Clique no botão para sincronizar manualmente</Typography>
            { lastSynchronization && (
              <Typography variant="body2" component="span">
                Ultima Sincronização:&nbsp;
                {lastSynchronization}
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Box m={1}>
              <Button
                color="primary"
                variant="contained"
                onClick={sincronize}
              >
                Sincronizar
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Box>
    </CustomGrid>
  );
}

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerDefinitions);
