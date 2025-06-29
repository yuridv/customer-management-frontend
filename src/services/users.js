import { Validate, Request } from '../utils/functions';

const list = async(payload) => new Promise(async(res, rej) => {
  try {
    await Validate(payload, {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      role: { type: 'string', equal: [ 'USER', 'ADMIN' ] },
      status: { type: 'number', equal: [ 0, 1 ] },

      page: { type: 'number' },
      limit: { type: 'number' }
    });

    const query = new URLSearchParams(payload).toString();
    return Request('/user?' + query, {
      method: 'GET'
    })
      .then((s) => res(s))
      .catch((e) => rej(e));
  } catch(err) {
    if (err.error) rej(err);
    rej({ error: 'Ocorreu algum erro interno no visual...\n Reporte aos nossos desenvolvedores...' });
  }
});

const create = async(payload) => new Promise(async(res, rej) => {
  try {
    await Validate(payload, {
      email: { type: 'email', required: true },
      password: { type: 'string', required: true },
      name: { type: 'string', required: true },
      role: { type: 'string', equal: [ 'USER', 'ADMIN' ], required: true }
    });

    return Request('/user', {
      method: 'POST',
      body: payload
    })
      .then((s) => res(s))
      .catch((e) => rej(e));
  } catch(err) {
    if (err.error) rej(err);
    rej({ error: 'Ocorreu algum erro interno no visual...\n Reporte aos nossos desenvolvedores...' });
  }
});

const update = async(payload) => new Promise(async(res, rej) => {
  try {
    await Validate(payload, {
      id: { type: 'string', required: true },

      email: { type: 'email' },
      password: { type: 'string' },
      name: { type: 'string' },
      role: { type: 'string', equal: [ 'USER', 'ADMIN' ] },
      status: { type: 'number', equal: [ 0, 1 ] }
    });

    return Request('/user?id=' + payload.id, {
      method: 'PATCH',
      body: payload
    })
      .then((s) => res(s))
      .catch((e) => rej(e));
  } catch(err) {
    if (err.error) rej(err);
    rej({ error: 'Ocorreu algum erro interno no visual...\n Reporte aos nossos desenvolvedores...' });
  }
});

export {
  list,
  create,
  update
};