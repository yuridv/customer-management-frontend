import { createContext, useContext, useState } from 'react';

import { auth } from '../services';

const Contexto = createContext();

const Provider = ({ children }) => {
  const [ user, setUser ] = useState();

  const isAuthenticated = () => auth.check()
    .then((s) => setUser(s.user) || true)
    .catch(() => setUser() && false);

  const Login = (payload) => new Promise(async(res, rej) => 
    auth.login(payload)
      .then((s) => {
        localStorage.setItem('token', s.token);
        res();
      })
      .catch((e) => rej(e))
  );

  const Logout = async() => {
    localStorage.setItem('token', '');
    setUser();

    window.location.href = '/login';
  };

  return (
    <Contexto.Provider value={{ user, setUser, isAuthenticated, Login, Logout }}>
      { children }
    </Contexto.Provider>
  );
};

const Context = () => useContext(Contexto);

export default {
  Provider,
  Context
};