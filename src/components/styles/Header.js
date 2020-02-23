export const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(10),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: 20,
  },
  containerNoMarginTop: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 20,
  },
  icon: {
    color: 'rgb(50,50,50)',
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'baseline',
    alignItems: 'center',
  },
  title: {
    color: 'rgb(50,50,50)',
    margin: 0,
    marginLeft: 5,
    fontSize: '1.8rem',
  },
  description: {
    color: 'rgba(0,0,0,.54)',
    margin: 5,
  },
});

export default { styles };
