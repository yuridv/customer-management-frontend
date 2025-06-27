import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Components } from '../utils/imports';

import Authenticate from '../contexts/Authenticate';
import Alerts from '../contexts/Alerts';

import background from '../assets/images/backgrounds/login.png';
import backgroundLines from '../assets/images/backgrounds/view.png';
import logo from '../assets/images/logos/black.png';

const Page = ({ style }) => {
  const navigate = useNavigate();

  const { setAlert } = Alerts.Context();
  const { Login, isAuthenticated } = Authenticate.Context();

  const [ payload, setPayload ] = useState({});

  useEffect(() => {
    (async() => {
      if (localStorage.getItem('token')) {
        const auth = await isAuthenticated();
        if (auth) return navigate('/');
        
        localStorage.setItem('token', '');
      }
    })();
  }, []);

  const loginButton = async() => await Login(payload)
    .then(() => navigate('/'))
    .catch((e) => {
      if (e.error?.includes('não foi preenchido') && payload.email && payload.password) return Login();
      
      return setAlert({
        title: 'Autenticação',
        description: e.error,
        buttons: [ { text: 'Tentar Novamente', color: 'red', onClick: () => setAlert() } ]
      }); 
    });

  return (
    <div className={ style.background } style={{ backgroundImage: `url(${background})` }}>
      <div className={ style.container }>
        <div className={ style.login }>
          <img className={ style.logo } src={ logo } />
          
          <div className={ style.inputs }>
            <div className={ style.input }>
              <a>E-mail <span>*</span></a>
              <Components.input
                id="email"
                type='text'
                icon="fa-duotone fa-solid fa-envelope"
                values={ payload }
                setValues={ setPayload }
              />
            </div>

            <div className={ style.input }>
              <a>Senha <span>*</span></a>
              <Components.input
                id="password"
                type='password'
                icon="fa-duotone fa-solid fa-lock-keyhole"
                values={ payload }
                setValues={ setPayload }
              />
            </div>
          </div>

          <div className={ style.button }>
            <Components.button 
              text='Entrar'
              color='orange'
              onClick={ loginButton }
            />
          </div>

        </div>
        <div className={ style.banner } style={{ backgroundImage: `url(${backgroundLines})` }}></div>
      </div>
    </div>
  );
};

export default Page;