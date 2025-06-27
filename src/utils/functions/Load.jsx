import { useState, useEffect } from 'react';

import Loading from '../../components/loading';

const Component = (props) => {
  const [ Page, setPage ] = useState();

  useEffect(() => {
    (async() => {
      if (!props.element) return;
      
      const element = await props.element();
      let style;

      if (props.style) style = await props.style();
      if (!style) console.warn('[Load]=> style not found for element: ', props.element);

      setPage(<element.default { ...props } style={ style || {} } />);
    })();
  }, [ props ]);

  return (
    <>
      {
        Page || (props.type === 'page' && <Loading />)
      }
    </>
  );
};

export default Component;