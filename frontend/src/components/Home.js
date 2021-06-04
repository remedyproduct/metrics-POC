import React from 'react';
import { OptimizelyFeature, withOptimizely } from '@optimizely/react-sdk';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Ads from './Ads';

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
  buyButton: {
    marginTop: theme.spacing(2),
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

  const buyOnlineRedirect = (shop) => {
    window.alert(shop);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <h1>Good {greeting}!</h1>
        <Ads />
        <OptimizelyFeature feature="buy_online">
          {(isEnabled, variables) => {
            if (isEnabled) {
              const shop = variables['shop'];
              return (
                <Button variant="contained" onClick={() => buyOnlineRedirect(shop)} className={classes.buyButton} color="primary">BUY ONLINE</Button>
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
