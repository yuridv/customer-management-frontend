import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Components } from '../utils/imports';

import Authenticate from '../contexts/Authenticate';

const Layout = ({ style }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = Authenticate.Context();

  const [ loaded, setLoaded ] = useState(false); 

  useEffect(() => {
    (async() => {
      if (!localStorage.getItem('token')) return navigate('/login');
      if (user) return setLoaded(true);

      const auth = await isAuthenticated();
      if (auth) return setLoaded(true);

      navigate('/login');
    })();
  }, []);

  return (
    <>
      {
        loaded ? (
          <>
            <aside>
              <Components.sidebar /> 
            </aside>

            <main className={ style.container }>
              <Outlet />
            </main>
          </>
        ) : (
          <Components.loading />
        )
      }
    </>
  );
};

export default Layout;