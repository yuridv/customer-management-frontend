// const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://universo-nautico-backend.onrender.com';
const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://universo-nautico-backend-production.up.railway.app';

const Request = (url, data = {}) => 
  new Promise(async(res, rej) => {
    try {

      if (!data.headers) data.headers = {};
      if (!data.headers['Content-Type']) data.headers['Content-Type'] = 'application/json; charset=utf-8';
        
      if (data.body) data.body = JSON.stringify(data.body);

      if (!data.headers['Authorization']) data.headers['Authorization'] = localStorage.getItem('token');

      const req = await fetch(baseURL + url, data);
      const result = await req.json();

      if (req.status === 401) {
        if (result.error) console.log('[REQUEST (401)]=> ', result.error);

        localStorage.setItem('token', '');
        window.location.href = '/login';
      }

      if (result.error) return rej(result);

      if ([ 200, 201, 202 ].includes(req.status)) return res(result);

      console.log('[Request]=> ', result, req);
      return rej({ error: 'Ocorreu algum erro interno...\nReporte aos nossos desenvolvedores!' });
    } catch(err) {
      if (String(err).includes('Failed to fetch')) return rej({ error: 'Sem resposta do servidor...\nTente novamente mais tarde...' });

      console.log('[Request(CATCH)]=> ', err);
      return rej({ error: 'Ocorreu algum erro inesperado...\nReporte aos nossos desenvolvedores!' });
    }
  });

export default Request;