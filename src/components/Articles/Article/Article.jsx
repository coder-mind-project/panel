import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { reactRouterParams } from '@/types';
import { Redirect } from 'react-router-dom';

import {
  Container,
  Box,
  useMediaQuery,
} from '@material-ui/core';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';

import { devices } from '@/config/devices';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

import { Scrollbars } from 'react-custom-scrollbars';
import MarkdownView from 'react-showdown';
import LoadingList from '@/components/LoadingList.jsx';
import ArticleHeader from './ArticleHeader';
import ArticleSettings from './ArticleSettings';

import {
  ArticleContent,
  CustomPaper,
  ArticleEditArea,
} from './styles';

function Article(props) {
  const {
    match,
    callToast,
  } = props;

  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsReason, setSettingsReason] = useState(null);
  const [reload, setReload] = useState(true);
  const [redirect, setRedirect] = useState('');

  const matches = useMediaQuery(devices.mobileExtraLarge);

  function handleChange(evt, attr) {
    const { value } = evt.target;
    setArticle({ ...article, [attr]: value });
  }

  function tooglePreview() {
    setShowPreview(!showPreview);
  }

  function defineChangeStateSuccessMsg(state) {
    return state === 'published' ? 'Artigo publicado com sucesso' : 'Operação realizada com sucesso';
  }

  function changeState(newState) {
    const { _id } = article;
    const url = `/articles/${_id}?state=${newState}`;

    axios.patch(url).then(() => {
      callToast(success(defineChangeStateSuccessMsg(newState)));
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });
  }

  function removeReason() {
    setSettingsReason(null);
  }

  function openSettings(reason = null) {
    if (typeof reason === 'string') {
      setSettingsReason(reason);
    }
    setShowSettings(true);
  }

  function closeSettings() {
    removeReason();
    setShowSettings(false);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getArticle() {
      setLoading(true);
      const { key } = match.params;

      const url = `/articles/${key}?type=customUri`;
      setReload(false);
      await axios(url).then((res) => {
        setArticle(res.data);
      }).catch((err) => {
        const msg = defineErrorMsg(err);
        callToast(error(msg));
        setTimeout(() => {
          setRedirect('/articles');
        }, 1000);
      });

      setLoading(false);
    }

    if (reload) {
      getArticle();
    }

    return () => source.cancel();
  }, [loading, article, reload, match, callToast]);

  return (
    <Container id="article-container">
      { redirect && <Redirect to={redirect} />}
      <ArticleSettings
        article={article}
        open={showSettings}
        close={closeSettings}
        reason={settingsReason}
        removeReason={removeReason}
      />
      { !loading && (
        <Box>
          <ArticleHeader
            article={article}
            onPublish={() => changeState('published')}
            onTooglePreview={tooglePreview}
            onShowSettings={openSettings}
            isPreviewed={showPreview}
          />
          <Box display="flex" height={425}>
            <ArticleEditArea sizewidth={showPreview && !matches ? 'withPreview' : 'withoutPreview'}>
              <CustomPaper>
                <ArticleContent
                  multiline
                  fullWidth
                  rows={21}
                  value={article.content || ''}
                  onChange={(evt) => handleChange(evt, 'content')}
                />
              </CustomPaper>
            </ArticleEditArea>
            { showPreview && !matches && (
              <ArticleEditArea>
                <CustomPaper>
                  <Scrollbars>
                    <MarkdownView
                      className="cm-preview"
                      markdown={article.content}
                      options={{ tablesHeaderId: true, tables: true, emoji: true }}
                    />
                  </Scrollbars>
                </CustomPaper>
              </ArticleEditArea>
            )}
          </Box>
        </Box>
      )}
      { loading
        && <LoadingList height={600} />
      }
    </Container>
  );
}

Article.propTypes = {
  match: reactRouterParams.isRequired,
  callToast: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Article);
