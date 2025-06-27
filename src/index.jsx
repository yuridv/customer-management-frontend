import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Routes } from './utils/imports';

createRoot(document.querySelector('#root'))
  .render(
    <RouterProvider router={ createBrowserRouter(Routes) } />
  );