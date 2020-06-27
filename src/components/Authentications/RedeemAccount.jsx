import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  NativeSelect,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Grid,
  Typography,
  LinearProgress,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Logo from '@/assets/coder-mind-painelv1-preto.png';

import Recaptcha from 'react-google-invisible-recaptcha';

import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '../../redux/toast/toastActions';
import { error as toastError } from '../../config/toasts';

import CustomButton from '../Buttons/Button';

import { defineErrorMsg } from '../../config/backend';

import { CAPTCHA_SITE_KEY } from '../../config/dataProperties';

import { cpfMask, celphoneMask } from '../../config/masks';

import {
  RedeemAccountContainer,
  RedeemAccountFormControl,
  RedeemAccountTextField,
} from './styles';

function RescueAccount(props) {
  const {
    back,
    callToast,
  } = props;

  const [option, setOption] = useState('menu');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [publicProfile, setPublicProfile] = useState('imNotSure');
  const [dateBegin, setDateBegin] = useState(null);
  const [msg, setMsg] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [steps, setSteps] = useState([
    { label: 'Informações pessoais', completed: false, index: 1 },
    { label: 'Informações da conta', completed: false, index: 2 },
    { label: 'Confirmação de dados', completed: false, index: 3 },
  ]);
  const [response, setResponse] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const matches = useMediaQuery('(max-width: 565px)');
  const recaptchaRef = useRef(null);

  function clearForms() {
    setCpf('');
    setCellphone('');
    setPublicProfile('');
    setEmail('');
    setDateBegin(null);
    setOption('menu');
  }

  function displayPublicProfile() {
    switch (publicProfile) {
      case 'yes': {
        return 'Sim';
      }
      case 'no': {
        return 'Não';
      }
      default: {
        return 'Não tenho certeza';
      }
    }
  }

  function setCompletedSteps(select, op) {
    const customSteps = steps.map((step, index) => {
      const actualStep = step;

      if (op === 'next') {
        if (index === currentStep) actualStep.completed = Boolean(select);
      }

      if (op === 'prev') {
        if (index === currentStep - 1) actualStep.completed = Boolean(select);
      }

      return actualStep;
    });

    return customSteps;
  }

  function nextStep() {
    const updatedSteps = setCompletedSteps(true, 'next');
    setSteps(updatedSteps);
    setCurrentStep(currentStep + 1);
  }

  function previousStep() {
    const updatedSteps = setCompletedSteps(false, 'prev');
    const updatedStep = currentStep > 0 ? currentStep - 1 : 0;
    setSteps(updatedSteps);
    setCurrentStep(updatedStep);
  }

  function handleChangeMaskData(attr) {
    return (event) => {
      if (typeof attr !== 'string') return;

      const { value } = { ...event.target };
      switch (attr) {
        case 'cpf': {
          setCpf(cpfMask(value));
          break;
        }
        default: {
          setCellphone(celphoneMask(value));
          break;
        }
      }
    };
  }

  function toogleOption(opt) {
    if (opt === 'menu') clearForms();
    setOption(opt);
  }

  function getData() {
    const payloadForOnlyPassword = { email, response: recaptchaToken };
    const payloadForMoreInformations = {
      email,
      cpf,
      cellphone,
      response: recaptchaToken,
      msg,
      publicProfile,
      dateBegin,
    };

    return { payloadForMoreInformations, payloadForOnlyPassword };
  }

  async function redeemAccount() {
    if (waiting) return;
    const url = '/auth';
    const { payloadForOnlyPassword, payloadForMoreInformations } = await getData();
    const data = option === 'onlyPassword' ? payloadForOnlyPassword : payloadForMoreInformations;
    const method = option === 'onlyPassword' ? 'patch' : 'put';

    setWaiting(true);
    await axios[method](url, data).then(() => {
      const message = method === 'patch' ? 'Enviamos um e-mail para você, as proximas instruções estarão por lá! ;)' : 'Solicitação enviada com sucesso, agora é com a gente, basta aguardar que entraremos em contato! ;)';
      setResponse(message);
    }).catch(async (err) => {
      const errorMessage = defineErrorMsg(err);
      callToast(toastError(errorMessage));
    });

    recaptchaRef.current.reset();
    setRecaptchaToken('');
    setWaiting(false);
  }

  function handleChange(setAttr) {
    return (event) => {
      const { value } = { ...event.target };
      setAttr(value);
    };
  }

  function handleDate(setAttr, date) {
    setAttr(date);
  }

  function captchaError() {
    setWaiting(false);
    setRecaptchaToken('');
    recaptchaRef.current.reset();
  }

  useEffect(() => {
    if (!recaptchaToken && (recaptchaRef && recaptchaRef.current && recaptchaRef.current.execute)) {
      recaptchaRef.current.execute();
    }
  }, [recaptchaToken]);

  return (
    <Box width="100%" height="100%">
      { waiting && <LinearProgress color="primary" />}
      <RedeemAccountContainer option={option}>
        <Box mt={option === 'emailAndPassword' ? 8 : 0}>
          <img src={Logo} alt="Logo" width="200" />
        </Box>
        <Recaptcha
          sitekey={CAPTCHA_SITE_KEY}
          ref={(ref) => { recaptchaRef.current = ref; }}
          onResolved={(token) => setRecaptchaToken(token)}
          style={{ zIndex: 1 }}
          onError={captchaError}
          onExpired={captchaError}
          locale="pt-br"
        />
        { option === 'menu' && !response
        && (
          <Box mt={3}>
            <Typography component="h1" variant="h6" align="center">Recuperação de conta Coder Mind</Typography>
            <Box p={2} display="flex" justifyContent="center" alignItems="center">
              <Typography component="h2" variant="body1" align="center">
                Selecione a opção que mais adequa ao seu problema
              </Typography>
            </Box>
            <Box width="100%" mb={2}>
              <Button color="primary" variant="contained" fullWidth onClick={() => toogleOption('emailAndPassword')}>Não sei meu e-mail</Button>
            </Box>
            <Box width="100%" mb={2}>
              <Button color="primary" variant="contained" fullWidth onClick={() => toogleOption('onlyPassword')}>Não sei minha senha</Button>
            </Box>
            <Box width="100%" mt={2} mb={2}>
              <Button color="primary" variant="text" fullWidth onClick={back}>Voltar</Button>
            </Box>
          </Box>
        )}
        { option === 'onlyPassword' && !response
        && (
          <Box mt={3} mb={2} maxWidth="500px">
            <Typography component="h1" variant="h6" align="center">Esqueci minha senha</Typography>
            <Box p={2} display="flex" justifyContent="center" alignItems="center">
              <Typography component="h2" variant="body1" align="center">
                Informe seu e-mail para prosseguir com a recuperação de senha,
                vamos lhe enviar um e-mail com mais instruções.
              </Typography>
            </Box>
            <Box width="100%" mb={2}>
              <RedeemAccountTextField
                label="E-mail"
                fullWidth
                onChange={handleChange(setEmail)}
                inputProps={{ autoComplete: 'email' }}
              />
            </Box>
            <CustomButton
              disabledIcon
              fullWidth
              onClick={redeemAccount}
              text={waiting ? 'Verificando...' : 'Confirmar'}
            />
            <Button
              color="primary"
              variant="text"
              fullWidth
              disabled={waiting}
              onClick={() => toogleOption('menu')}
            >
              Voltar
            </Button>
          </Box>
        )}
        { option === 'emailAndPassword' && !response
          && (
            <Box marginTop={option === 'emailAndPassword' ? 5 : 0}>
              <Box display="flex" justifyContent="center" mb={2}>
                <Typography component="h1" variant="h6" align="center">Esqueci meu e-mail</Typography>
              </Box>
              <Typography component="p" variant="body1">
                Para recuperar sua conta, vamos fazer algumas perguntas sobre seu acesso.
              </Typography>
              <Typography component="p" variant="body2">
                Tente preencher todos os campos com as informações mais recentes que você se lembra,
                isto ajudará numa análise mais apurada para recuperar sua conta.
              </Typography>
              <Stepper activeStep={currentStep} orientation={matches ? 'vertical' : 'horizontal'}>
                { steps.map((step) => (
                  <Step key={step.index} completed={step.completed}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                mb={2}
              >
                <Box display="flex" alignItems="center" mb={matches ? 3 : 0}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => setDialog(true)}
                  >
                    Não sei uma ou mais informações solicitadas
                  </Button>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
                  <Box mr={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={currentStep > 0 ? () => previousStep() : () => toogleOption('menu')}
                    >
                      {currentStep > 0 ? 'Voltar' : 'Sair'}
                    </Button>
                  </Box>
                  { currentStep < steps.length - 1
                    && (
                      <Box>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => nextStep()}
                        >
                          Próximo
                        </Button>
                      </Box>
                    )}
                  { currentStep === steps.length - 1
                      && (
                        <Box>
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={redeemAccount}
                          >
                            Confirmar
                          </Button>
                        </Box>
                      )
                    }
                </Box>
              </Box>
              { currentStep === 0
                && (
                <RedeemAccountFormControl fullWidth>
                  <RedeemAccountTextField
                    label="E-mail de contato"
                    value={email}
                    fullWidth
                    onChange={handleChange(setEmail)}
                    helperText="Este e-mail será utilizado para nossa equipe entrar em contato em caso de necessidade de avaliação dos nossos administradores"
                  />
                  <RedeemAccountTextField
                    label="Informe seu número de telefone"
                    value={cellphone}
                    fullWidth
                    onChange={handleChangeMaskData('cellphone')}
                    inputProps={{ maxLength: 15 }}
                    helperText="Caso não seu número de telefone não esteja cadastrado, deixe o campo em branco"
                  />
                </RedeemAccountFormControl>
                )}
              { currentStep === 1
                && (
                  <RedeemAccountFormControl fullWidth>
                    <Box width="100%" mb={2}>
                      <FormControl fullWidth>
                        <Typography component="p" variant="body2">
                          Seu perfil tem acesso público no website para os leitores?
                        </Typography>
                        <NativeSelect
                          value={publicProfile}
                          onChange={handleChange(setPublicProfile)}
                          inputProps={{
                            id: 'public-profile',
                          }}
                        >
                          <option value="imNotSure">Não tenho certeza</option>
                          <option value="yes">Sim</option>
                          <option value="no">Não</option>
                        </NativeSelect>
                      </FormControl>
                    </Box>
                    <Box width="100%" mb={2}>
                      <FormControl fullWidth>
                        <Typography component="p" variant="body2">
                          Quando você começou a usar nossa plataforma?
                        </Typography>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <KeyboardDatePicker
                            clearable
                            cancelLabel="Cancelar"
                            clearLabel="Limpar"
                            value={dateBegin}
                            onChange={(date) => handleDate(setDateBegin, date)}
                            mask="__/__/____"
                            maxDate={new Date()}
                            maxDateMessage="Data acima do permitido"
                            format="DD/MM/YYYY"
                            invalidDateMessage="Formato de data inválido"
                            helperText="Informe uma data aproximada, caso não tenha certeza"
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </FormControl>
                    </Box>
                  </RedeemAccountFormControl>
                )}
              { currentStep === 2
                && (
                  <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                    <Grid item xs={12} md={6}>
                      <Typography component="h2" variant="h6">
                        Confirmar dados:
                      </Typography>
                      <Typography component="p" variant="body2">
                        Ao confirmar, realizaremos uma análise das informações fornecidas.
                        É importante ressaltar que enviar mais de uma soliticação de recuperação
                        irá atrasar a análise de seu pedido de recuperação de senha, então,
                        seja paciente que retornaremos um feedback já já, combinado? =D
                      </Typography>
                      <Box mb={2}>
                        <ol>
                          <li>
                            <Typography component="p" variant="body2">
                              E-mail de contato:
                              <br />
                              {email || 'Não informado'}
                            </Typography>
                          </li>
                          <li>
                            <Typography component="p" variant="body2">
                              Telefone cadastrado:
                              <br />
                              {cellphone || 'Não informado'}
                            </Typography>
                          </li>
                          <li>
                            <Typography component="p" variant="body2">
                              Seu perfil tem acesso público no website para os leitores?
                              <br />
                              {displayPublicProfile()}
                            </Typography>
                          </li>
                          <li>
                            <Typography component="p" variant="body2">
                              Quando você começou a usar nossa plataforma?
                              <br />
                              {dateBegin ? dateBegin.format('DD/MM/YYYY') : 'Não informado'}
                            </Typography>
                          </li>
                        </ol>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Descreva seu problema (opcional)"
                        value={msg}
                        fullWidth
                        onChange={handleChange(setMsg)}
                        variant="outlined"
                        color="primary"
                        multiline
                        rows={6}
                        helperText="É importante descrever bem sua situação, isto ajudará na análise de nossos administradores para a recuperação de sua conta."
                      />
                    </Grid>
                  </Box>
                )}
            </Box>
          )}
        { Boolean(response)
          && (
            <Box>
              <Box height="100%" display="flex" flexDirection="column" alignItems="center" mt={3}>
                <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" mb={3}>
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#218838" />
                  </Box>
                  <Box>
                    {response}
                  </Box>
                </Box>
                <Button variant="outlined" color="primary" onClick={back}>Ir para a tela de autenticação</Button>
              </Box>
            </Box>
          )}
        <Dialog onClose={() => setDialog(false)} aria-labelledby="dialog-more-information" open={dialog}>
          <DialogTitle id="customized-dialog-title" onClose={() => setDialog(false)}>
            Mais informações
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" component="p">
              Caso nao saiba uma ou mais informações não tem problema!
            </Typography>
            <Typography variant="body1" component="p">
              Preencha o formulário com o máximo de informações possíveis, dependendo,
              estas informações poderão ser analisadas por uma pessoa.
            </Typography>
            <Typography variant="body1" component="p">
              Você receberá um feedback em até 24 horas.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)} color="primary">
              Entendi
            </Button>
          </DialogActions>
        </Dialog>
      </RedeemAccountContainer>
    </Box>
  );
}

RescueAccount.propTypes = {
  back: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RescueAccount);
