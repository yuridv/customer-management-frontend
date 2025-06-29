import { Validate, Request } from '../utils/functions';

const list = async(payload) => new Promise(async(res, rej) => {
  try {
    await Validate(payload, {
      id: { type: 'string' },
      name: { type: 'string' },
      cpf: { type: 'cpf' },
      phone: { type: 'phone' },
      email: { type: 'email' },
      birthday: { type: 'date' },
      status: { type: 'string', equal: [ 'IN_PROGRESS', 'FINISHED', 'PENDING', 'CANCELED' ] },
      user: { type: 'string' },
      createdAt: { type: 'date' },

      page: { type: 'number' },
      limit: { type: 'number' }
    });

    const query = new URLSearchParams(payload).toString();
    return Request('/client?' + query, {
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
      name: { type: 'string', required: true },
      cpf: { type: 'cpf', required: true },
      phone: { type: 'phone', required: true },
      email: { type: 'email', required: true },
      birthday: { type: 'date', required: true }
    });

    return Request('/client', {
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

const edit = async(payload) => new Promise(async(res, rej) => {
  try {
    await Validate(payload, {
      id: { type: 'string', required: true },

      name: { type: 'string' },
      cpf: { type: 'cpf' },
      phone: { type: 'phone' },
      email: { type: 'email' },
      birthday: { type: 'date' },
      status: { type: 'string', equal: [ 'IN_PROGRESS', 'FINISHED', 'PENDING', 'CANCELED' ] },
      user: { type: 'string' }
    });

    return Request('/client?id=' + payload.id, {
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

const remove = async(payload) => new Promise(async(res, rej) => {
  try {
    await Validate(payload, {
      id: { type: 'string', required: true }
    });

    return Request('/client?id=' + payload.id, {
      method: 'DELETE'
    })
      .then((s) => res(s))
      .catch((e) => rej(e));
  } catch(err) {
    if (err.error) rej(err);
    rej({ error: 'Ocorreu algum erro interno no visual...\n Reporte aos nossos desenvolvedores...' });
  }
});


const counter = async() => new Promise(async(res, rej) => {
  try {
    return Request('/client/counter', {
      method: 'GET'
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
  edit,
  remove,

  counter
};