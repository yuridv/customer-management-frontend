import { useState, useEffect } from 'react';

import { Components } from '../../utils/imports';

import Alerts from '../../contexts/Alerts';

import { users } from '../../services';

const Page = ({ style }) => {
  const { setAlert } = Alerts.Context();

  const [ menu, setMenu ] = useState();
  const [ filters, setFilters ] = useState({});

  const [ pagination, setPagination ] = useState();
  const [ list, setList ] = useState();

  useEffect(() => { List(); }, []);

  const List = (payload, page = 1) => {
    if (page < 1) return;
    if (pagination?.total && page > pagination.total) return;
    
    setList();
    return users.list({ ...payload, page })
      .then((r) => {
        setPagination(r.page)
        setList(r.users.map((user) => !user.ativo ? { ...user, ativo: '0' } : user));
      })
      .catch((e) => setAlert({
        title: 'Usuários',
        description: e.error,
        buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => setAlert() } ]
      }));
  };

  const Create = (payload) => users.create(payload)
    .then((r) => setAlert({ 
      title: 'Cadastrar Usuário', 
      description: 'O usuário foi cadastrado com sucesso!', 
      status: 'success',
      buttons: [ { text: 'Continuar', color: 'green', onClick: () => setAlert() || setMenu() || List({ id: r.user._id }) } ]
    }))
    .catch((e) => setAlert({
      title: 'Cadastrar Usuário',
      description: e.error,
      buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => setAlert() } ]
    }));

  const Edit = (id, payload) => users.update({ id, ...payload })
    .then((r) => setAlert({ 
      title: 'Editar Usuário', 
      description: 'Os dados do usuário foram alterados com sucesso!', 
      status: 'success',
      buttons: [ { text: 'Continuar', color: 'green', onClick: () => setAlert() || setMenu() || setList(list.map((item) => item._id === r.user._id ? r.user : item)) } ]
    }))
    .catch((e) => setAlert({
      title: 'Editar Usuário',
      description: e.error,
      buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => setAlert() } ]
    }));

  return (
    <>
      <div className={ style.container }>
        <div className={ style.title }>
          <a>Lista de Usuários</a>
        </div>

        <div className={ style.register }>
          <Components.button 
            icon='fa-regular fa-user-plus' 
            text={ window.innerWidth <= 768 ? '' : 'Novo Usuário' } 
            color='orange'
            onClick={ () => setMenu({ type: 'create' }) }
          />
        </div>

        <div className={ style.filters }>
          <Components.filters
            filters={ camps.filter((camp) => ![ 'password', 'avatar' ].includes(camp.id)) }

            values={ filters }
            setValues={ setFilters }

            onClick={ List }
          />
        </div>

        <Components.tables.modern
          columns={ columns }
          list={ list }
          actions={ [
            { icon: 'fa-solid fa-pen-to-square', onClick: (id) => setMenu({ type: 'edit', id }) }
          ] }
        />

        <div className={ style.pages }>
          <a>Pagina { pagination?.current || 1 } de { pagination?.total || 1 } </a>
          <div>
            <i className="fas fa-chevrons-left" onClick={ () => List(filters, 1) } />
            <i className="fas fa-chevron-left" onClick={ () => List(filters, pagination ? pagination?.current - 1 : 1) } />
            <i className="fas fa-chevron-right" onClick={ () => List(filters, pagination ? pagination?.current + 1 : 1) } />
            <i className="fas fa-chevrons-right" onClick={ () => List(filters, pagination?.total || 1) } />
          </div>
        </div>

      </div>

      {
        menu?.type === 'create' && (
          <Components.submenus.form
            close={ setMenu }

            icon='fa-solid fa-user-plus'
            title='Novo Usuário'
            description='Informe os dados do usuário para prosseguir'

            inputs={ camps.filter((camp) => ![ 'createdAt', 'ativo' ].includes(camp.id)) }

            buttons={[
              { icon: 'fa-regular fa-folder-plus', text: 'Finalizar Cadastro', color: 'orange', onClick: Create }
            ]}
          />
        )
      }

      {
        menu?.type === 'edit' && menu?.id && (
          <Components.submenus.form
            close={ setMenu }

            icon='fa-solid fa-user'
            title='Dados do Usuário'
            description='Atualize os dados pessoais do usuário'

            inputs={ camps }
            values={ list.find((user) => user._id === menu.id) }

            buttons={[
              { icon: 'fa-regular fa-pen', text: 'Atualizar Dados', color: 'orange', onClick: (payload) => Edit(menu.id, payload) }
            ]}
          />
        )
      }
    </>
  );
};

export default Page;

const columns = [
  { id: 'avatar', label: 'Perfil', type: 'avatar', width: 5, avatar : true },
  { id: 'name', label: 'Nome', width: 25, mobile: 35 },
  { id: 'email', label: 'E-mail', width: 25 },
  { id: 'role', label: 'Cargo', width: 10, mobile: 25, center: true, options: { 'USER': { value: 'Usuário' }, 'ADMIN': { value: 'Administrador', color: '#dcbc04' } } },
  { id: 'status', label: 'Status', width: 15, mobile: 25, center: true, options: { '1': { value: 'ATIVO', color: '#00FF00' }, '0': { value: 'DESATIVADO', color: '#FF0000' } } },
  { id: 'createdAt', label: 'Data do Cadastro', type: 'date', center: true, width: 15 },
  { id: 'actions', label: 'Ações', width: 5, mobile: 15, center: true }
];

const camps = [
  { id: 'name', title: 'Nome', placeholder: 'Nome Completo', icon: 'fa-regular fa-signature', type: 'text', required: true, full: true },
  { id: 'email', title: 'E-mail', placeholder: 'E-mail', autoComplete: 'new-password', icon: 'fa-regular fa-envelope', type: 'text', required: true },
  { id: 'password', title: 'Senha', icon: 'fa-regular fa-lock', type: 'password', autoComplete: 'new-password', required: true },
  { id: 'role', title: 'Cargo', icon: 'fa-regular fa-briefcase', type: 'select', required: true, options: [ { name: 'Usuário', value: 'USER' }, { name: 'Administrador', value: 'ADMIN' } ] },
  { id: 'status', title: 'Status', icon: 'fa-regular fa-tag', type: 'select', options: [ { name: 'Ativo', value: '1' }, { name: 'Desativado', value: '0' } ] },
  { id: 'avatar', type: 'file' }
];