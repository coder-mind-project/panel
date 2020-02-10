import React from "react"

import { Grid, Box, Icon, CardContent,
        Typography, CardActions, Card,
        Divider } from "@material-ui/core"
import { Link } from 'react-router-dom'

import Button from '../../Button.jsx'

const ThemesAndCategoriesSection = props => {
    const {user} = {...props}

    return (
        <Grid item xs={12}>
            <Box mb={3}>
                <Box id="themes" width="100%" display="flex" alignItems="center">
                    <Box mr={1}>
                        <Icon>folder_open</Icon>
                    </Box>
                    <h3>Temas & Categorias</h3>
                </Box>
                <span>
                    {user && user.tagAdmin ?
                        'Visualize, altere e remova temas e categorias para artigos':'Visualize temas e categorias para artigos'
                    }
                </span>
            </Box>
            <Box width="100%" display="flex" flexWrap="wrap" alignItems="center">
                <Grid item xs={12} md={6}>
                    <Card className="card-management">
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Box mr={1} display="flex" alignItems="center">
                                    <Icon>
                                        bookmark
                                    </Icon>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <h3>
                                        Temas
                                    </h3>
                                </Box>
                            </Box>
                            <Typography component="p" variant="body1">
                                { user && user.tagAdmin ? 'Crie, altere e remova temas para artigos' : 'Visualize temas para artigos' }
                            </Typography>
                            { user && user.tagAdmin &&
                                <Typography component="p" variant="body2">
                                    Estes temas são relacionados aos artigos, 
                                    isto é, configure os temas disponibilizados 
                                    para a inclusão e edição de artigos.
                                </Typography>
                            }
                        </CardContent>
                        <CardActions>
                            <Box width="100%" ml={2} mr={2}>
                                <Link to="/themes" className="linkRouter">
                                    <Button color="default"
                                        icon="exit_to_app"
                                        text="Acessar"
                                    />
                                </Link>
                            </Box>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className="card-management">
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Box mr={1} display="flex" alignItems="center">
                                    <Icon>
                                        category
                                    </Icon>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <h3>
                                        Categorias
                                    </h3>
                                </Box>
                            </Box>
                            <Typography component="p" variant="body1">
                            { user && user.tagAdmin ? 'Crie, altere e remova categorias para artigos' : 'Visualize categorias para artigos' }
                            </Typography>
                            { user && user.tagAdmin &&
                                <Typography component="p" variant="body2">
                                    Estas categorias são relacionados aos artigos, 
                                    isto é, configure as categorias disponibilizadas 
                                    para a inclusão e edição de artigos.
                                </Typography>
                            }
                        </CardContent>
                        <CardActions>
                            <Box width="100%" ml={2} mr={2}>
                                <Link to="/categories" className="linkRouter">
                                    <Button color="default"
                                        icon="exit_to_app"
                                        text="Acessar"
                                    />
                                </Link>
                            </Box>
                        </CardActions>
                    </Card>
                </Grid>
            </Box>
            { user && user.tagAdmin &&
                <Box width="100%" mt={2}>
                    <Divider/>
                </Box>
            }
        </Grid>
    )
}

export default ThemesAndCategoriesSection