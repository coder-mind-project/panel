import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Avatar from 'react-avatar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import {
  Container, Grid, Grow, ClickAwayListener,
  MenuList, MenuItem, useMediaQuery,
  Popper, Paper, Box, Icon, IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { callToast } from '../../../redux/toast/toastActions';
import { success, error } from '../../../config/toasts';

import { backendUrl, defineErrorMsg } from '../../../config/backend';
import { displayDate } from '../../../config/masks';
import { styles } from './styles/ArticleBlock';


import CustomButton from '../../Buttons/Button';
import CustomChip from '../../Chip.jsx';

import LogoDefault from '../../../assets/HPArticleThumb.png';

import '../../../pages/css/defaultPage.css';

const useStyles = makeStyles(styles);

const ArticleBlock = (props) => {
  const matches400 = useMediaQuery('(min-width: 400px)');
  const matches = useMediaQuery('(min-width: 960px)');
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [article, setArticle] = React.useState(props.article);
  const [redirectTo, setRedirectTo] = React.useState('');

  const anchorRef = React.useRef(null);

  const toogle = (event) => {
    /* Usado para habilitar e desabilitar o menu em telas pequenas */
    if (open && anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(!open);
  };

  const reloadPage = () => {
    setTimeout(() => window.location.href = '/articles', 3000);
  };

  const remove = (id) => {
    /* Usado para remover artigos */

    if (!id) props.callToast(error('Artigo não encontrado'));

    const url = `${backendUrl}/articles/management/${id}`;
    axios.delete(url).then(() => {
      props.callToast(success('Artigo removido com sucesso'));
      reloadPage();
    }).catch(async (err) => {
      const msg = await defineErrorMsg(err);
      props.callToast(error(msg));
    });
  };

  const publish = (id) => {
    /* Usado para publicar artigos */

    if (!id) props.callToast(error('Artigo não encontrado'));

    const url = `${backendUrl}/articles/management/${id}?op=publish`;
    axios.patch(url).then((res) => {
      props.callToast(success('Artigo publicado com sucesso'));
      setArticle(res.data);
    }).catch(async (err) => {
      const msg = await defineErrorMsg(err);
      props.callToast(error(msg));
    });
  };

  const inactive = (id) => {
    /* Usado para inativar artigos */

    if (!id) props.callToast(error('Artigo não encontrado'));

    const url = `${backendUrl}/articles/management/${id}?op=inactive`;
    axios.patch(url).then((res) => {
      props.callToast(success('Artigo inativado com sucesso'));
      setArticle(res.data);
    }).catch(async (err) => {
      const msg = await defineErrorMsg(err);
      props.callToast(error(msg));
    });
  };

  const boost = (id) => {
    /* Usado para impulsionar artigos */

    if (!id) props.callToast(error('Artigo não encontrado'));

    const url = `${backendUrl}/articles/management/${id}?op=boost`;
    axios.patch(url).then((res) => {
      props.callToast(success('Artigo impulsionado com sucesso'));
      setArticle(res.data);
    }).catch(async (err) => {
      const msg = await defineErrorMsg(err);
      props.callToast(error(msg));
    });
  };

  const active = (id) => {
    /* Usado para reativar artigos */

    if (!id) props.callToast(error('Artigo não encontrado'));

    const url = `${backendUrl}/articles/management/${id}?op=active`;
    axios.patch(url).then(async (res) => {
      props.callToast(success('Artigo reativado com sucesso'));
      setArticle(res.data);
    }).catch(async (err) => {
      const msg = await defineErrorMsg(err);
      props.callToast(error(msg));
    });
  };


  return (
    <Grid container className={!matches ? classes.containerXs : classes.container}>
      {redirectTo
                && <Redirect to={redirectTo} />
            }
      {!matches
                && (
                <Container className={classes.info}>
                  <Box className="betweenInline fullWidth">
                    <Box width="100%" display="flex" alignItems="center">
                      <Grid item xs={10}>
                        <h3>{article.title}</h3>
                      </Grid>
                      <Grid item xs={2}>
                        <Box ref={anchorRef}>
                          <IconButton aria-haspopup="true" aria-owns="menu-list-options" onClick={toogle}>
                            <Icon>more_vert</Icon>
                          </IconButton>
                        </Box>
                      </Grid>
                    </Box>
                    <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                          <Paper id="menu-list-options">
                            <ClickAwayListener onClickAway={toogle}>
                              <MenuList>
                                {article.published && !article.inactivated
                                                        && (
                                                        <MenuItem className="centerInline" key={1} onClick={() => inactive(article._id)}>
                                                          <Icon className={classes.iconButton}>block</Icon>
                                                          Inativar
                                                        </MenuItem>
                                                        )
                                                    }
                                {article.published && article.inactivated
                                                        && (
                                                        <MenuItem className="centerInline" key={2} onClick={() => active(article._id)}>
                                                          <Icon className={classes.iconButton}>restore</Icon>
                                                          Reativar
                                                        </MenuItem>
                                                        )
                                                    }
                                <MenuItem key={3} onClick={() => boost(article._id)}>
                                  <Icon className="marginRight">share</Icon>
                                  Impulsionar
                                </MenuItem>
                                <MenuItem key={4} onClick={() => remove(article._id)}>
                                  <Icon className="marginRight">delete</Icon>
                                  Remover
                                </MenuItem>
                                {!article.published
                                                        && (
                                                        <MenuItem key={5} onClick={() => publish(article._id)}>
                                                          <Icon className="marginRight">publish</Icon>
                                                          Publicar
                                                        </MenuItem>
                                                        )
                                                    }
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Box>
                  <Box className={classes.descriptionArea}>
                    <Box className={classes.descriptionText}>
                      {article.shortDescription}
                    </Box>
                  </Box>
                </Container>
                )
            }
      <Grid item xs={12} sm={12} md={4} className={classes.logo}>
        { matches
                    && (
                    <img
                      className={matches ? classes.imgArticle : classes.imgArticleXs}
                      src={article.smallImg ? `${backendUrl}/${article.smallImg}` : LogoDefault}
                      alt={article.title}
                    />
                    )
                }
        { !matches
                    && (
                    <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="center">
                      {matches400
                            && (
                            <Box className={classes.moreInformation} mr={1}>
                              {article.author && article.author.name
                                ? (
                                  <span className={classes.author}>
                                    <Avatar
                                      className="marginRight"
                                      src={`${backendUrl}/${article.author.profilePhoto}`}
                                      name={article.author.name}
                                      size={40}
                                      round="20px"
                                    />
                                    <strong>{article.author.name}</strong>
                                  </span>
                                ) : 'Autor desconhecido'
                                }
                            </Box>
                            )
                        }
                      {article.inactivated
                            && (
                            <CustomChip
                              color="warning"
                              sizeIcon="small"
                              icon="warning"
                              text="Inativo"
                            />
                            )
                        }
                      {article.published && !article.inactivated && !article.boosted
                            && (
                            <CustomChip
                              color="primary"
                              sizeIcon="small"
                              icon="done"
                              text="Publicado"
                            />
                            )
                        }
                      {article.boosted
                            && (
                            <CustomChip
                              color="primary"
                              sizeIcon="small"
                              icon="star"
                              text="Impulsionado"
                            />
                            )
                        }
                    </Box>
                    )
                }
      </Grid>
      {!matches
                && (
                <Container className={classes.buttonXsScreen}>
                  <CustomButton
                    fullWidth
                    text="Abrir"
                    icon="edit"
                    onClick={() => setRedirectTo(`/article/${article.customURL}`)}
                  />
                </Container>
                )
            }
      {matches
                && (
                <Grid item xs={8} className={classes.description}>
                  <Grid item xs={8} className={classes.info}>
                    <h3>{article.title}</h3>
                    <Box className={classes.descriptionArea}>
                      <Box className={classes.descriptionText}>
                        {article.shortDescription}
                      </Box>
                    </Box>
                    {article.author && article.author.name
                      ? (
                        <Box mb={1} className={classes.author}>
                          <Avatar
                            className="marginRight"
                            src={`${backendUrl}/${article.author.profilePhoto}`}
                            name={article.author.name}
                            size={40}
                            round="20px"
                          />
                          <strong>{article.author.name}</strong>
                        </Box>
                      ) : 'Autor desconhecido'
                            }
                    {article.inactivated
                            && (
                            <CustomChip
                              color="warning"
                              sizeIcon="small"
                              icon="warning"
                              text="Inativo"
                            />
                            )
                        }
                    {article.published && !article.inactivated && !article.boosted
                            && (
                            <CustomChip
                              color="primary"
                              sizeIcon="small"
                              icon="done"
                              text="Publicado"
                            />
                            )
                        }
                    {article.boosted
                            && (
                            <CustomChip
                              color="primary"
                              sizeIcon="small"
                              icon="star"
                              text="Impulsionado"
                            />
                            )
                        }
                  </Grid>
                  <Grid item xs={4} className={classes.buttonsOptions}>
                    <Link
                      to={`/article/${article.customURL ? article.customURL : article._id}`}
                      className="linkRouter"
                    >
                      <CustomButton
                        className={classes.button}
                        fullWidth
                        icon="create"
                        text="Abrir"
                      />
                    </Link>
                    {article.published
                            && (
                            <CustomButton
                              className={classes.button}
                              fullWidth
                              icon={article.inactivated ? 'restore' : 'block'}
                              text={article.inactivated ? 'Reativar' : 'Inativar'}
                              color="inherit"
                              variant="outlined"
                              onClick={() => (article.inactivated ? active(article._id) : inactive(article._id))}
                            />
                            )
                        }
                    {!article.published
                            && (
                            <CustomButton
                              className={classes.button}
                              fullWidth
                              icon="publish"
                              text="Publicar"
                              color="inherit"
                              variant="outlined"
                              onClick={() => publish(article._id)}
                            />
                            )
                        }
                    <CustomButton
                      className={classes.button}
                      fullWidth
                      icon="share"
                      text="Impulsionar"
                      color="inherit"
                      variant="outlined"
                      onClick={() => boost(article._id)}
                    />
                    <CustomButton
                      className={classes.button}
                      fullWidth
                      icon="delete"
                      text="Remover"
                      color="inherit"
                      variant="outlined"
                      onClick={() => remove(article._id)}
                    />
                    <Grid className={classes.moreInformation}>
                      <Box>
                        Criado em:
                        {' '}
                        {displayDate(article.created_at) || 'N/C'}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                )
            }
    </Grid>
  );
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleBlock);
