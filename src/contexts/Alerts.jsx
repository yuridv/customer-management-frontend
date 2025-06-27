import { createContext, useContext, useState } from 'react';

import { Components } from '../utils/imports';
import style from '../assets/css/contexts/alerts.module.css';

const status = {
  'error': { color: 'red', icon: 'fa-solid fa-hexagon-xmark' },
  'success': { color: 'green', icon: 'fa-solid fa-circle-check' },
  'warn': { color: 'gold', icon: 'fa-solid fa-triangle-exclamation' }
};

const Contexto = createContext();

const Provider = ({ children }) => {
  const [ alert, setAlert ] = useState();

  return (
    <Contexto.Provider value={{ alert, setAlert }}>
      { 
        alert && (
          <div className={ style.background }>
            <div className={ style.container }>
              <i 
                className={ status[alert.status || 'error']?.icon } 
                style={{ color: status[alert.status || 'error']?.color }} 
              />

              <h1>{ alert.title }</h1>

              <div className={ style.description }>
                {
                  alert.description && (
                    alert.description.includes('\n') ? (
                      alert.description.split('\n').map((r, i) => <p key={i + '_alert'}>{r}</p>)
                    ) : (
                      <p>{alert.description}</p>
                    )
                  )
                }
              </div>

              <div className={ style.buttons }>
                {
                  alert.buttons?.map((r, i) => (
                    <Components.button 
                      key={i}
                      text={r.text}
                      color={r.color}
                      customStyle={{ borderRadius: '15px' }}
                      onClick={r.onClick}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )
      }
      { children }
    </Contexto.Provider>
  );
};

const Context = () => useContext(Contexto);

export default {
  Provider,
  Context
};