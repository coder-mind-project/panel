import React, { useState, useEffect } from 'react';

import { Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';
import { backendUrl } from '../../../config/backend';

import { BoxAnswers as CustomBox } from './styles';

import TicketAnswer from './TicketAnswer';


import { error as toastError } from '../../../config/toasts';
import { callToast as toastEmitter } from '../../../redux/toastActions';

function BoxAnswers(props) {
  const {
    latestAnswer,
    clearLatestAnswer,
    ticket,
    updatedAnswers,
    hasError,
    clearCurrentError,
    callToast,
  } = { ...props };

  const [answers, setAnswers] = useState([]);
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    async function getAnswers() {
      if (answers.length === 0 && !latestAnswer && !loaded && !hasError) {
        const url = `${backendUrl}/tickets/${ticket._id}`;

        const res = await axios(url);
        const responses = res && res.data && res.data.responses ? res.data.responses : [];

        setloaded(true);
        setAnswers(responses);
      } else if (latestAnswer && !hasError) {
        const responses = answers.map((response) => response);
        const newAnswer = {
          ...latestAnswer,
          index: answers.length + 1,
        };

        responses.push(newAnswer);

        setAnswers(responses);
        clearLatestAnswer();
      } else if (!latestAnswer && !hasError) {
        const elementsPending = answers.filter((element) => element.pending);

        if (updatedAnswers.length === answers.length && elementsPending.length > 0) {
          const responses = answers.map((element) => {
            const checkedElement = updatedAnswers
              .find((elem) => elem.index === element.index && element.pending) || element;

            return checkedElement;
          });

          setAnswers(responses);
        }
      } else if (hasError) {
        clearCurrentError();

        if (!hasError.answer) {
          callToast(toastError(hasError.msg));
          return;
        }

        const responses = answers.map((element) => {
          const checkedElement = element;
          if (checkedElement.createdAt === hasError.answer.createdAt) {
            checkedElement.error = hasError;
          }
          return checkedElement;
        });

        setAnswers(responses);
      }
    }

    function scrollToDown() {
      const element = document.querySelector('#answers');
      if (element) element.scrollTo(0, element.scrollHeight);
    }

    scrollToDown();
    getAnswers();
  },
  [
    answers,
    latestAnswer,
    clearLatestAnswer,
    updatedAnswers,
    ticket,
    loaded,
    hasError,
    callToast,
    clearCurrentError,
  ]);

  return (
    <CustomBox id="answers">
      { (!answers || Boolean(answers && answers.length === 0))
        && (
          <Alert severity="info">
            <Typography component="span" variant="body2">
              Este ticket não possui respostas, seja o primeiro a responder!
            </Typography>
          </Alert>
        )
      }
      { answers && answers.length > 0 && answers.map((elem) => (
        <TicketAnswer key={elem.index} answer={elem} />
      ))
      }
    </CustomBox>
  );
}

const mapStateToProps = (state) => ({ toast: state.config });
const mapDisptachToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDisptachToProps)(BoxAnswers);
