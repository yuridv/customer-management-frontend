import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Alerts from '../../contexts/Alerts';
import { clients } from '../../services';

const Page = ({ style }) => {
  const navigate = useNavigate();
  const { setAlert } = Alerts.Context();

  const [ count, setCount ] = useState();
  const [ list, setList ] = useState();

  useEffect(() => {
    clients.counter()
      .then((r) => setCount(r.count))
      .catch((e) => setAlert({
        title: 'Contador de Clientes',
        description: e.error,
        buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => window.location.reload() } ]
      }));

    clients.list()
      .then((r) =>
        setList(
          r.clients
            .splice(0, 10)
            .map((client) => {
              const date = client.createdAt
                .split('T')[0]
                .split('-')
                .reverse()
                .join('/');

              const days = new Date(
                new Date() -
                new Date(client.createdAt).setHours(new Date(client.createdAt).getHours() - 3)
              )
                .getDate();

              client.description = `Cadastrado há ${days} dia(s) atrás (${date})`;

              return client;
            })
        )
      )
      .catch((e) => setAlert({
        title: 'Últimos Clientes',
        description: e.error,
        buttons: [ { text: 'Tentar novamente...', color: 'red', onClick: () => window.location.reload() } ]
      }));
  }, []);

  return (
    <div className={ style.container }>
      <div className={ style.title }>
        <a>Painel de Controle</a>
      </div>

      <div className={ style.container_menus }>
        <div className={ style.left }>
          <div className={ style.container_counter }>
            <div className={ style.title_menu }>
              <a>Status do Clientes</a>
              <p>Quantidade total de clientes em cada status</p>
            </div>

            { !count ? (
              <div className={ style.loading }>
                <i className='fa-solid fa-spinner fa-spin' />
              </div>
            ) : (
              <div className={ style.counter }>
                <div className={ style.item }>
                  <a>Total de Clientes</a>
                  <strong>{ count.total }</strong>
                  <p>Todos os seus clientes</p>
                  <i className="fa-regular fa-clipboard-list" />
                </div>

                <div className={ style.item }>
                  <a>Em Andamento</a>
                  <strong>{ count.IN_PROGRESS }</strong>
                  <p>Clientes em processo de atendimento</p>
                  <i className="fa-regular fa-truck-fast" />
                </div>

                <div className={ style.item }>
                  <a>Finalizado</a>
                  <strong>{ count.FINISHED }</strong>
                  <p>Clientes com pedidos concluidos</p>
                  <i className="fa-regular fa-box-archive" />
                </div>

                <div className={ style.item }>
                  <a>PENDENTES</a>
                  <strong>{ count.PENDING }</strong>
                  <p>Clientes com dados faltando</p>
                  <i className="fa-regular fa-hourglass-half" />
                </div>

                <div className={ style.item }>
                  <a>CANCELADOS</a>
                  <strong>{ count.CANCELED }</strong>
                  <p>Clientes que cancelaram o pedido</p>
                  <i className="fa-regular fa-ban" />
                </div>
              </div>
            )}
          </div>

          <div className={ style.container_clients }>
            <div className={ style.title_menu }>
              <a>Últimos Clientes</a>
              <p>Lista dos seus últimos clientes cadastrados no sistema</p>
            </div>

            { !list ? (
              <div className={ style.loading }>
                <i className='fa-solid fa-spinner fa-spin' />
              </div>
            ) : (
              <>
                <div className={ style.list }>
                  {
                    list?.map((client, i) => (
                      <div key={ i } className={ style.client }>
                        <i className="fa-regular fa-user" />
                        <div className={ style.info }>
                          <a>{ client.name }</a>
                          <p>{ client.description }</p>
                        </div>
                        <div className={ style.view }>
                          <a onClick={ () => navigate(`/clients?id=${client._id}`) }>Ver Cliente</a>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className={ style.more }>
                  <a onClick={ () => navigate('/clients') }>Ver todos os clientes</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;