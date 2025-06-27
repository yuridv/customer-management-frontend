// Importing required components and functions from React Router and local components
import { Directory } from '../functions';
import { Load } from '../functions';

// Dynamically import pages, layouts, and CSS files
const components = Directory(import.meta.glob('../../components/**'), 'components');
const styles = Directory(import.meta.glob('../../assets/css/components/**'), 'assets/css/components');

// List where routes ready for export will be saved
const Result = {};

// Get all your pages inside the Routes folder to be mapped
for (const component in components) {
  const path = component
    .split('/');

  const last = path.pop();
  let pointer = Result;

  for (const p of path) {
    pointer[p] = pointer[p] || {};
    pointer = pointer[p];
  }

  const style = Object.keys(styles)
    .find((item) => item === component);

  Object.assign(pointer, {
    get [last.split('.')[0]]() {
      return (props) => <Load { ...props } element={ components[component] } style={ styles[style] } />;
    }
  });
}

export default Result;