import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
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
  }
}));

export default function Ads() {
  const classes = useStyles();
  const [items, setItems] = useState("");

  useEffect(() => {
    const jwt = window.sessionStorage.getItem("jwt");

    fetch('http://localhost:8005/feature', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    .then(json => json.json())
    .then(response => {
      setItems(response.items)
    })
    .catch(error => {
      // Feature is not Enabled for the user
    });
  }, []);

  return (items &&
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
