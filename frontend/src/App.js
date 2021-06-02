import React, { useState, useEffect } from 'react';
import {
  createInstance,
  OptimizelyProvider,
} from '@optimizely/react-sdk'

import Login from './components/Login';
import Home from './components/Home';
import './App.css';

const optimizely = createInstance({
  sdkKey: 'DPzcaJRvhpcagqKUHdM1z',
  eventBatchSize: 100,
  eventFlushInterval: 1000
})

function App() {
  const [jwt, setJwt] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const jwt = window.sessionStorage.getItem("jwt");
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    setJwt(jwt);
    setUser(user);
  }, []);

  const authenticate = (token, attributes) => {
    const user = {
      "id": attributes.email,
      "attributes": {
        "country": attributes.country,
        "age": parseInt(attributes.age)
      }
    };

    window.sessionStorage.setItem("jwt", token);
    window.sessionStorage.setItem("user", JSON.stringify(user));

    setJwt(token);
    setUser(user);
  };

  return (
    <>
      { !jwt
        ? <Login callback={authenticate} />
        : <OptimizelyProvider
            optimizely={optimizely}
            user={user}>
              <Home />
          </OptimizelyProvider>
      }
    </>
  );
}

export default App;
