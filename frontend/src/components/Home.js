import React from 'react';
import { OptimizelyFeature, withOptimizely } from '@optimizely/react-sdk';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    textAlign: 'right'
  },
  ads: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  card: {
    minWidth: 275,
  },
  logout: {
    margin: theme.spacing(1),
  }
}));

function Home({ optimizely }) {
  const classes = useStyles();

  const hour = (new Date()).getHours();
  // eslint-disable-next-line
  const greeting = (hour < 12 && "Morning" || hour < 18 && "Afternoon" || "Evening");

  const restartApp = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      delete window.sessionStorage.jwt;
      delete window.sessionStorage.user;

      window.location.reload(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <h1>Good {greeting}!</h1>
        <OptimizelyFeature feature="recommendations">
          {(isEnabled, variables) => {
            if (isEnabled) {
              const items = variables['items'];
              return (
                <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      ads by Optimizely
                    </Typography>
                    <Typography className={classes.ads} variant="h2" component="p">
                      {items}
                    </Typography>
                  </CardContent>
                </Card>
              );
            }
          }}
        </OptimizelyFeature>
        <Button onClick={restartApp} className={classes.logout} color="secondary">Logout</Button>
      </div>
    </Container>
  );
}

export default withOptimizely(Home);
