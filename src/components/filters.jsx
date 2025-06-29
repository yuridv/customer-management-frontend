import { useState } from 'react';

import { Components } from '../utils/imports';

const Component = ({
  style = {},
  
  filters,
  values,
  setValues,
  
  onClick
}) => {
  const [ expanded, setExpanded ] = useState();

  return (
    <>
      {
        expanded && (
          <Components.submenus.form
            close={ () => setExpanded() }

            icon="fa-duotone fa-solid fa-filters"
            title="Filtros"
            description="Coloque os dados que deseja encontrar"

            inputs={ filters }

            values={ values }
            setValues={ setValues }

            buttons={ [
              {
                icon: 'fa-regular fa-magnifying-glass', 
                text: 'Filtrar',
                color: 'orange',
                onClick
              } 
            ] }
          />
        )
      }

      <div className={ style.container }>
        <div className={ style.filters }>
          {
            filters
              .slice(0, window.innerWidth <= 768 ? 1 : 3)
              .map((filter, i) => (
                <div key={ i } className={ style.input }>
                  {
                    filter.type === 'select' ? (
                      <Components.select
                        id={ filter.id }
                        values={ values }
                        setValues={ setValues }

                        icon={ 'fa-regular ' + filter.icon }
                        placeholder={ filter.placeholder }
                        options={ filter.options }
                        disabled={ filter.disabled }
                      />
                    ) : (
                      <Components.input
                        id={ filter.id }
                        values={ values }
                        setValues={ setValues }

                        type={ filter.type }
                        icon={ 'fa-regular ' + filter.icon }
                        placeholder={ filter.placeholder }
                        autoComplete={ filter.autoComplete }
                        disabled={ filter.disabled }
                      />
                    )
                  }
                </div>
              ))
          }
        </div>

        <div className={ style.buttons }>
          <Components.button 
            icon="fa-regular fa-filters"
            color="orange"
            onClick={ () => setExpanded(true) }
          />
          <Components.button
            icon="fa-regular fa-magnifying-glass"
            text="Filtrar"
            color="orange"
            onClick={ () => onClick(values) }
          />
        </div>
      </div>
    </>
  );
};

export default Component;