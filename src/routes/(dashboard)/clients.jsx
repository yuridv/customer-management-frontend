import { useState, useEffect } from 'react';

import { Components } from '../../utils/imports';

import Alerts from '../../contexts/Alerts';
import Authenticate from '../../contexts/Authenticate';

import { users, clients } from '../../services';

const Page = ({ style }) => {
  const { user } = Authenticate.Context();
  const { setAlert } = Alerts.Context();

  const [ menu, setMenu ] = useState();
  const [ filters, setFilters ] = useState({});

  const [ Users, setUsers ] = useState(); 
  const [ list, setList ] = useState();
  const [ pagination, setPagination ] = useState();

  useEffect(() => {
    (async() => {
      await users.list({ limit: 999 })
        .then((r) => {
          setUsers(r.users);

          camps
            .find((camp) => camp.id === 'user')
            .options = r.users.map((user) => ({ name: user.name, value: user._id }));
        })
        .catch((e) => setAlert({
          title: 'Lista de Usuários',
          description: e.error,
          buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => window.location.reload() } ]
        }));

      const params = new URLSearchParams(window.location.search);
      
      if (params.get('id')) {
        await List({ id: params.get('id') });
        return setMenu({ type: 'edit', id: params.get('id') });
      }

      await List();
    })();
  }, []);

  const List = (payload, page = 1) => {
    if (page < 1) return;
    if (pagination?.total && page > pagination.total) return;
    
    setList();
    return clients.list({ ...payload, page, limit: 12 })
      .then((r) => setPagination(r.page) || setList(r.clients) || console.log(r.clients))
      .catch((e) => setAlert({
        title: 'Clientes',
        description: e.error,
        buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => setAlert() } ]
      }));
  };

  const Create = (payload) => clients.create(payload)
    .then((r) => setAlert({ 
      title: 'Cadastrar Cliente', 
      description: 'O cliente foi cadastrado com sucesso!', 
      status: 'success',
      buttons: [ { text: 'Continuar', color: 'green', onClick: () => setAlert() || setMenu() || List({ id: r.client._id }) } ]
    }))
    .catch((e) => setAlert({
      title: 'Cadastrar Cliente',
      description: e.error,
      buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => setAlert() } ]
    }));

  const Edit = (id, payload) => clients.update({ id, ...payload })
    .then((r) => setAlert({ 
      title: 'Editar Cliente', 
      description: 'Os dados do cliente foram alterados com sucesso!', 
      status: 'success',
      buttons: [ { text: 'Continuar', color: 'green', onClick: () => setAlert() || setMenu() || setList(list.map((item) => item._id === r.client._id ? r.client : item)) } ]
    }))
    .catch((e) => setAlert({
      title: 'Editar Cliente',
      description: e.error,
      buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => setAlert() } ]
    }));

  const Remove = (id) => clients.remove({ id })
    .then(() => setAlert({ 
      title: 'Deletar Cliente',
      description: 'Os dados do cliente foram deletados com sucesso!',
      status: 'success',
      buttons: [ { text: 'Continuar', color: 'green', onClick: () => setAlert() || setMenu() || List(filters) } ]
    }))
    .catch((e) => setAlert({
      title: 'Deletar Cliente',
      description: e.error,
      buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => setAlert() } ]
    }));

  return (
    <>
      <div className={ style.container }>
        <div className={ style.title }>
          <a>Lista de Clientes</a>
        </div>

        <div className={ style.register }>
          <Components.button 
            icon='fa-regular fa-folder-plus' 
            text={ window.innerWidth <= 768 ? '' : 'Cadastrar Cliente' } 
            color='orange'
            onClick={ () => setMenu({ type: 'create' }) }
          />
        </div>

        <div className={ style.filters }>
          <Components.filters
            filters={ camps.filter((camp) => camp.id !== 'user' || user?.role === 'ADMIN') }

            values={ filters }
            setValues={ setFilters }

            onClick={ List }
          />
        </div>

        <Components.tables.simple
          columns={ columns }
          list={ list }
          actions={ [
            { icon: 'fa-solid fa-pen-to-square', onClick: (id) => setMenu({ type: 'edit', id }) }
          ] }
          users={ Users }
        />

        <div className={ style.pages }>
          <a>Pagina { pagination?.current || 1 } de { pagination?.total || 1 } - Total de Clientes: { pagination?.count || 0 } </a>
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
            title='Cadastrar Cliente'
            description='Informe os dados do cliente para prosseguir'

            inputs={ camps.filter((camp) => ![ 'createdAt', 'user', 'status' ].includes(camp.id)) }

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
            title='Dados do Cliente'
            description='Atualize os dados pessoais do cliente'
            inputs={ camps.filter((camp) => ![ 'createdAt' ].includes(camp.id) && (camp.id !== 'user' || user?.role === 'ADMIN')) }
            values={ list.find((client) => client._id === menu.id) }

            buttons={[
              user.role === 'ADMIN' && ({
                icon: 'fa-regular fa-trash',
                text: 'Deletar Cliente', 
                color: 'red', 
                onClick: () => setAlert({
                  status: 'warn',
                  title: 'Você tem certeza?',
                  description: 'Você tem certeza que deseja deletar esse cliente do sistema?',
                  buttons: [
                    { text: 'Cancelar', color: 'orange', onClick: () => setAlert() }, 
                    { text: 'Deletar', color: 'red', onClick: () => Remove(menu.id) }
                  ]
                }) 
              }),
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
  { id: 'name', label: 'Nome', width: 15, mobile: 50 },
  { id: 'phone', label: 'Telefone', type: 'phone', width: 10, center: true },
  { id: 'cpf', label: 'CPF', type: 'cpf', width: 10, center: true },
  { id: 'status', label: 'Status', width: 15, mobile: 35, center: true, options: { 'IN_PROGRESS': { value: 'EM ANDAMENTO', color: '#BDE462' }, 'FINISHED': { value: 'FINALIZADO', color: '#52BDFF' }, 'PENDING': { value: 'PENDENTE', color: '#FFE252' }, 'CANCELED': { value: 'CANCELADO', color: '#FF5252' } } },
  { id: 'createdAt', label: 'Data do Cadastro', type: 'date', center: true, width: 10 },
  { id: 'birthday', label: 'Aniversário', type: 'date', center: true, width: 10 },
  { id: 'vendedor', label: 'Vendedor', center: true, width: 25 },
  { id: 'actions', label: 'Ações', width: 5, mobile: 15, center: true }
];

const camps = [
  { id: 'name', title: 'Nome', placeholder: 'Nome do cliente', icon: 'fa-regular fa-signature', type: 'text', required: true, full: true },
  { id: 'cpf', title: 'CPF', placeholder: '___.___.___-__', icon: 'fa-regular fa-address-card', type: 'text', required: true },
  { id: 'phone', title: 'Telefone', placeholder: '(__) _ ____-____', icon: 'fa-regular fa-phone', type: 'text', required: true },
  { id: 'email', title: 'E-mail', placeholder: 'E-mail', icon: 'fa-regular fa-envelope', type: 'text', required: true },
  { id: 'birthday', title: 'Data de Aniversario', icon: 'fa-regular fa-calendar', type: 'date', required: true },
  { id: 'createdAt', title: 'Data do Cadastro', icon: 'fa-regular fa-calendar', type: 'date' },
  { id: 'user', title: 'Vendedor', icon: 'fa-regular fa-user', type: 'select', options: [] },
  { id: 'status', title: 'Status', icon: 'fa-regular fa-tag', type: 'select', options: [ { name: 'EM ANDAMENTO', value: 'IN_PROGRESS' }, { name: 'FINALIZADO', value: 'FINISHED' }, { name: 'PENDENTE', value: 'PENDING' }, { name: 'CANCELADO', value: 'CANCELED' } ] }
];