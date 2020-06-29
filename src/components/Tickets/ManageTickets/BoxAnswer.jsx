import React, { useState } from 'react';
import {
  IconButton,
  Icon,
} from '@material-ui/core';

import { connect } from 'react-redux';
import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';

import { CustomInputBase, BoxFieldAnswer } from './styles';

function BoxAnswer(props) {
  const {
    sendEmail,
    ticketId,
    sendedAnswer,
    emitAnswers,
    emitError,
    theme,
  } = { ...props };

  const [answer, setAnswer] = useState('');

  function handleChangeAnswer(evt) {
    const { value } = evt.target;
    setAnswer(value);
  }

  function sendAnswer() {
    const element = document.querySelector('#new-ticket-answer');
    if (element) element.focus();

    if (answer.trim() === '') {
      setAnswer('');
      return;
    }

    const tempAnswer = {
      msg: answer,
      pending: 'true',
      index: null,
      created: new Date(),
    };

    sendedAnswer(tempAnswer);

    const url = `/tickets/${ticketId}`;

    const data = {
      response: answer,
      sendEmail,
    };

    setAnswer('');

    axios.put(url, data).then((res) => {
      const responses = res && res.data && res.data.responses ? res.data.responses : [];
      emitAnswers(responses);
    }).catch((error) => {
      const msg = defineErrorMsg(error);
      const stack = { error, msg, answer: tempAnswer };
      emitError(stack);
    });
  }

  return (
    <BoxFieldAnswer theme={theme}>
      <CustomInputBase
        theme={theme}
        placeholder="Resposta"
        multiline
        rowsMax="3"
        value={answer}
        onChange={handleChangeAnswer}
        id="new-ticket-answer"
      />
      <IconButton variant="text" onClick={sendAnswer}>
        <Icon>
          send
        </Icon>
      </IconButton>
    </BoxFieldAnswer>
  );
}

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(BoxAnswer);
