import React, { useState, useRef, useEffect } from 'react';

import {
  Grid, Box, Button, Container, TextField, Dialog,
  DialogTitle, DialogActions, DialogContent, FormControl,
  Select, Stepper, Step, StepLabel, useMediaQuery, Divider,
  Typography, ButtonBase,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';


import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Recaptcha from 'react-google-invisible-recaptcha';

import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast } from '../redux/toastActions';
import { error as toastError } from '../config/toasts';

import Logo from '../assets/coder-mind-painelv1-preto.png';
import CustomButton from './Button';

import { backendUrl, defineErrorMsg } from '../config/backend';

import { CAPTCHA_SITE_KEY } from '../config/dataProperties';

import { cpfMask, celphoneMask } from '../config/masks';

import '../pages/css/defaultPage.css';
import '../pages/css/forms.css';
import '../pages/auth-section/css/RedeemAccount.css';

function RescueAccount(props) {
  const { back, setToast } = { ...props };
  const [option, setOption] = useState('menu');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [celphone, setCelphone] = useState('');
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
    setCelphone('');
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
          setCelphone(celphoneMask(value));
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
      celphone,
      response: recaptchaToken,
      msg,
      publicProfile,
      dateBegin,
    };

    return { payloadForMoreInformations, payloadForOnlyPassword };
  }

  async function redeemAccount() {
    const url = `${backendUrl}/auth`;
    const { payloadForOnlyPassword, payloadForMoreInformations } = await getData();
    const data = option === 'onlyPassword' ? payloadForOnlyPassword : payloadForMoreInformations;
    const method = option === 'onlyPassword' ? 'patch' : 'put';

    setWaiting(true);
    await axios[method](url, data).then((res) => {
      setResponse(res.data);
      clearForms();
    }).catch(async (err) => {
      const errorMessage = defineErrorMsg(err);
      setToast(toastError(errorMessage));
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
    if (!recaptchaToken) recaptchaRef.current.execute();
  }, [recaptchaToken]);

  return (
    <Container className="redeem-account-section">
      <div className="logo-area">
        <img src={Logo} alt="Logo" width="200" />
      </div>
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
          <Grid item xs={12}>
            <Box width="100%" display="flex" justifyContent="center" alignItems="center">
              <h3>Recuperação de conta Coder Mind</h3>
            </Box>
            <Box p={2} display="flex" justifyContent="center" alignItems="center">
              <p>Selecione a opção que mais adequa ao seu problema</p>
            </Box>
            <Box width="100%" mb={2}>
              <Button color="secondary" variant="contained" fullWidth onClick={() => toogleOption('emailAndPassword')}>Não sei meu e-mail</Button>
            </Box>
            <Box width="100%" mb={2}>
              <Button color="secondary" variant="contained" fullWidth onClick={() => toogleOption('onlyPassword')}>Não sei minha senha</Button>
            </Box>
            <Box width="100%" mt={2} mb={2}>
              <Button color="secondary" variant="text" fullWidth onClick={back}>Voltar</Button>
            </Box>
          </Grid>
        )}
      { option === 'onlyPassword' && !response
        && (
          <Grid item xs={12} className="redeem-account-area">
            <h2>Esqueci minha senha</h2>
            <p>
              Informe seu e-mail para prosseguir com a recuperação de senha,
              vamos lhe enviar um e-mail com mais instruções.
            </p>
            <TextField
              label="E-mail"
              className="modalFormInput"
              fullWidth
              onChange={handleChange(setEmail)}
              inputProps={{ autoComplete: 'email' }}
            />
            <CustomButton
              disabledIcon
              fullWidth
              disabled={waiting}
              onClick={redeemAccount}
              text={waiting ? 'Verificando...' : 'Confirmar'}
            />
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              disabled={waiting}
              onClick={() => toogleOption('menu')}
            >
              Voltar
            </Button>
          </Grid>
        )}
      { option === 'emailAndPassword' && !response
          && (
            <Grid item xs={12} className="redeem-account-area">
              <h2>Esqueci meu e-mail</h2>
              <p>
                Para recuperar sua conta, vamos fazer algumas perguntas sobre seu acesso.
              </p>
              <p>
                Tente preencher todos os campos com as informações mais recentes que você se lembra,
                isto ajuda numa análise mais apurada para recuperar sua conta.
              </p>
              <Stepper activeStep={currentStep} orientation={matches ? 'vertical' : 'horizontal'}>
                { steps.map((step) => (
                  <Step key={step.index} completed={step.completed}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box className="stepper-hud">
                <Box display="flex" alignItems="center" mb={matches ? 3 : 0}>
                  <ButtonBase
                    variant="text"
                    className="form-text"
                    onClick={() => setDialog(true)}
                  >
                    <u>
                      Não sei uma ou mais informações solicitadas
                    </u>
                  </ButtonBase>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
                  <Box mr={2}>
                    <Button color="secondary" variant="contained" onClick={currentStep > 0 ? () => previousStep() : () => toogleOption('menu')}>
                      {currentStep > 0 ? 'Voltar' : 'Sair'}
                    </Button>
                  </Box>
                  { currentStep < steps.length - 1
                    && (
                      <Box>
                        <Button color="secondary" variant="contained" onClick={() => nextStep()}>
                          Próximo
                        </Button>
                      </Box>
                    )}
                </Box>
              </Box>
              { currentStep === 0
                && (
                <FormControl fullWidth>
                  <TextField
                    label="Informe seu CPF"
                    value={cpf}
                    fullWidth
                    onChange={handleChangeMaskData('cpf')}
                    inputProps={{ maxLength: 14 }}
                    className="modalFormInput"
                  />
                  <TextField
                    label="Informe seu número de telefone"
                    value={celphone}
                    fullWidth
                    onChange={handleChangeMaskData('celphone')}
                    inputProps={{ maxLength: 15 }}
                    className="modalFormInput"
                  />
                  <TextField
                    label="E-mail de contato"
                    value={email}
                    fullWidth
                    onChange={handleChange(setEmail)}
                    className="modalFormInput"
                    helperText="Este e-mail será utilizado para nossa equipe entrar em contato em caso de necessidade de avaliação dos nossos administradores"
                  />
                </FormControl>
                )}
              { currentStep === 1
                && (

                  <FormControl fullWidth className="formGroup">
                    <FormControl fullWidth className="formGroup">
                      <Typography component="p" variant="body2">
                        Seu perfil tem acesso público no website para os leitores?
                      </Typography>
                      <Select
                        native
                        value={publicProfile}
                        onChange={handleChange(setPublicProfile)}
                        inputProps={{
                          id: 'public-profile',
                        }}
                      >
                        <option value="imNotSure">Não tenho certeza</option>
                        <option value="yes">Sim</option>
                        <option value="no">Não</option>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth className="formGroup">
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
                  </FormControl>
                )}
              { currentStep === 2
                && (
                  <FormControl fullWidth className="formGroup">
                    <h3>Confirmar dados:</h3>
                    <span className="small-text">Ao confirmar, realizaremos uma análise das informações fornecidas. É importante ressaltar que enviar mais de uma soliticação de recuperação irá atrasar a análise de seu pedido de recuperação de senha, então, seja paciente que retornaremos um feedback já já, combinado? =D</span>
                    <Box mb={2}>
                      <ul>
                        <li>
                          CPF:&nbsp;
                          <strong>{cpf || 'Não informado'}</strong>
                        </li>
                        <li>
                          Telefone de contato:&nbsp;
                          <strong>{celphone || 'Não informado'}</strong>
                        </li>
                        <li>
                          Seu perfil tem acesso público no website para os leitores?&nbsp;
                          <strong>{displayPublicProfile()}</strong>
                        </li>
                        <li>
                          Quando você começou a usar nossa plataforma?&nbsp;
                          <strong>{dateBegin ? dateBegin.format('DD/MM/YYYY') : 'Não informado'}</strong>
                        </li>
                      </ul>
                    </Box>
                    <Divider className="separator" />
                    <TextField
                      label="Descreva seu problema (opcional)"
                      value={msg}
                      fullWidth
                      onChange={handleChange(setMsg)}
                      className="modalFormInput"
                      variant="outlined"
                      color="secondary"
                      multiline
                      rows={6}
                      helperText="É importante descrever bem sua situação, isto ajudará na análise de nossos administradores para a recuperação de sua conta."
                    />
                    <Button color="secondary" disabled={waiting} variant="contained" fullWidth onClick={redeemAccount}>{waiting ? 'Verificando...' : 'Confirmar'}</Button>
                  </FormControl>
                )}
            </Grid>
          )}
      { Boolean(response)
          && (
            <Grid item xs={12} className="redeem-account-area">
              <Box height="100%" display="flex" alignItems="center">
                <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                  <Box mr={2} mb={2}>
                    <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#218838" />
                  </Box>
                  <Box mb={5}>
                    {response}
                  </Box>
                  <Button variant="outlined" color="secondary" onClick={back}>Ir para a tela de autenticação</Button>
                </Box>
              </Box>
            </Grid>
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
          <Button onClick={() => setDialog(false)} color="secondary">
            Entendi
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ setToast: callToast }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RescueAccount);
