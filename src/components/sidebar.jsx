import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { Components } from '../utils/imports';
import Authenticate from '../contexts/Authenticate';

import logo_icon from '../assets/images/logos/icon.png';
import logo_text from '../assets/images/logos/text.png';
import profile from '../assets/images/profile.png';

const Pages = [
  { icon: 'fa-light fa-objects-column', text: 'Painel de Controle', href: '/' },
  { icon: 'fa-light fa-users', text: 'Lista de Clientes', href: '/clients' },
  { icon: 'fa-light fa-gear', text: 'Configurações', href: '/configs', role: 'ADMIN' }
];

const Component = ({ style = {} }) => {
  const location = useLocation();

  const { user, Logout } = Authenticate.Context();
  const ref = useRef(null);

  const [ expanded, setExpanded ] = useState();
  const [ open, setOpen ] = useState();

  useEffect(() => {
    const page = Pages.find((item) => item.href === location.pathname);
    if (page?.role === 'ADMIN' && user?.role !== 'ADMIN') window.location.href = '/';
  }, [ location.pathname ]);

  useEffect(() => {
    if (!expanded) return;
    const clickOutside = (e) => ref.current && !ref.current.contains(e.target) && setExpanded(false);

    if (ref) document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [ expanded ]);

  return (
    <>
      <i onClick={ () => setExpanded(!expanded) } className={ `fa-solid fa-bars-staggered ${style.mobile}` } />

      <div ref={ref} className={ `${style.container} ${expanded && style.expanded}` }>

        <div className={ style.expand }>
          <i
            className={ `fa-solid fa-bars-staggered ${style.expand_button}` }
            onClick={ () => setExpanded(!expanded) }
          />
        </div>

        <div className={ style.line } />

        <Link className={ style.logo } to='/'>
          <img src={ logo_icon } />
          <img className={ style[ expanded ? 'visible' : 'invisible' ] } src={ logo_text } />
        </Link>

        <div className={ style.line } />

        <a className={ `${style.category} ${style[ expanded ? 'visible' : 'invisible' ]}` }>PAGINAS</a>

        <div className={ style.pages }>
          <div className={ `${style.container_page} ${expanded && style.expanded}` }>
            {
              Pages.map((page, i) => (
                <Link 
                  key={ i + '_page' } 
                  className={ `${style.item} ${location.pathname === page.href && style.selected}` }
                  to={ page.href }
                  onClick={ () => setExpanded() }
                >
                  <i className={ page.icon } />
                  <p className={ style[ expanded ? 'visible' : 'invisible' ] }>{ page.text }</p>
                </Link>
              ))
            }
          </div>
        </div>

        <div className={ style.bottom }>
          <a className={ `${style.category} ${style[ expanded ? 'visible' : 'invisible' ]}` }>PERFIL</a>

          <div onClick={ () => setOpen('Password') } className={ style.profile }>
            <img src={ user?.avatar || profile } />
            <a className={ style[ expanded ? 'visible' : 'invisible' ] }>{
              user?.name?.split(' ')
                .filter((w) => ![ 'de', 'da', 'do', 'dos', 'das' ].includes(w.toLowerCase()) )
                .map((w, index) =>
                  index === 0 ? 
                    w[0].toUpperCase() + w.slice(1).toLowerCase() :
                    w[0].toUpperCase() + '.'
                )
                .join(' ')
              || 'INDEFINIDO'
            }</a>
            {/* <i className={ `fa-regular fa-lock-keyhole ${style.password} ${style[ expanded ? 'visible' : 'invisible' ]}` } /> */}
          </div>

          <div className={ style.logout } onClick={ Logout }>
            <i className="fa-light fa-right-from-bracket" />
            <a className={ style[ expanded ? 'visible' : 'invisible' ] } >SAIR</a>
          </div>

        </div>
      </div>
    </>
  );
};

export default Component;