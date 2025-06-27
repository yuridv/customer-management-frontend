import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Alerts from './contexts/Alerts';
import Authenticate from './contexts/Authenticate';
import { Routes } from './utils/imports';

createRoot(document.querySelector('#root'))
  .render(
    <Alerts.Provider>
      <Authenticate.Provider>
        <RouterProvider router={ createBrowserRouter(Routes) } />
      </Authenticate.Provider>
    </Alerts.Provider>
  );