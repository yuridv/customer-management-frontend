import { Validate, Request } from '../utils/functions';

const login = async(payload) => new Promise(async(res, rej) => {
  try {
    await Validate(payload, {
      email: { required: true, type: 'string' },
      password: { required: true, type: 'string' }
    });

    return Request('/auth/token', {
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

const check = async() => new Promise(async(res, rej) => {
  try {
    return Request('/auth/check', {
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
  check,
  login
};