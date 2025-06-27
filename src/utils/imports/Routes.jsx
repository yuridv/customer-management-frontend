// Importing required components and functions from React Router and local components
import { Navigate } from 'react-router-dom';
import { Directory } from '../functions';
import { Load } from '../functions';

// Dynamically import pages, layouts, and CSS files
const routes = Directory(import.meta.glob('../../routes/**'), 'routes');
const layouts = Directory(import.meta.glob('../../layouts/**'), 'layouts');
const styles = Directory(import.meta.glob('../../assets/css/**'), 'assets/css');

// List where routes ready for export will be saved
const Result = [ { path: '*', element: <Navigate to="/" /> } ];

// Get all your pages inside the Routes folder to be mapped
for (const route in routes) {
  const path = route
    .split('/')
    .filter(p => !/^\(.*\)$/.test(p));

  // Automatically find the CSS file for the current page
  const style = Object.keys(styles)
    .find((item) => item === 'routes/' + route);

  // Converts "main" or "index" files into the home route of their folder (e.g. /routes/dashboard/main.jsx => /dashboard)
  if ([ 'main', 'index' ].includes(path.at(-1))) path.pop();
  if (!path.length) path[0] = '/';

  // Warn if multiple routes map to the same URL (e.g. "routes/dashboard.jsx" and "routes/dashboard/main.jsx" both become "/dashboard")
  if (Result.find(r => r.path === path.join('/'))) {
    console.error(`[DUPLICATE ROUTE]=> There is already another route with the path equal to "${path.join('/')}" for the file "${route}"`);
    continue;
  }

  // Load the layout closest to the route path (e.g. routes/dashboard/page.jsx → layouts/dashboard.jsx)
  const layout = Object.keys(layouts)
    .filter((item) => route.startsWith(item))
    .sort((a, b) => b.split('/').length - a.split('/').length)[0];

  // Automatically find the CSS file for the current layout
  const styleLayout = Object.keys(styles)
    .find((item) => item === 'layouts/' + layout);

  // Creates the route element and saves it in the Routes to be exported and used list
  Result.push({
    path: path.join('/'),
    element: layout && <Load element={ layouts[layout] } style={ styles[styleLayout] } type="page" />,
    children: [ { index: true, element: <Load element={ routes[route] } style={ styles[style] } type="page" /> } ]
  });
}

export default Result;