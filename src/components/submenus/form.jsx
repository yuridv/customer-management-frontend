import { useState } from 'react';

import { Components } from '../../utils/imports';
import profile from '../../assets/images/profile.png';

const Component = ({
  style = {},

  close,

  icon,
  title,
  description,

  inputs,
  values,
  setValues,

  buttons
}) => {
  const [ payload, setPayload ] = useState(() =>
    inputs?.reduce((acc, input) => {
      let val = values?.[input.id];
      if (val) {
        if (input.type === 'date' && String(val).includes('T')) val = String(val).split('T')[0];
        if (input.id === 'cpf') val = String(val).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        if (input.id === 'phone') val = String(val).replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
        acc[input.id] = val;
      }
      return acc;
    }, {}) || {}
  );

  return (
    <div className={ style.container }>
      <div className={ style.menu }>
        <i onClick={ close } className={ `fa-regular fa-xmark ${style.close}` }></i>

        <div className={ style.title }>
          <i className={ icon } />
          <div>
            <a>{ title }</a>
            <p>{ description }</p>
          </div>
        </div>

        <div className={ style.camps }>
          {
            inputs?.find((input) => input.type === 'file') && (
              <div className={ style.input_file }>
                <img src={ values ? values[inputs?.find((input) => input.type === 'file')?.id] || profile : profile } />
              </div>
            )
          }
          

          <div className={ `${style.inputs} ${inputs?.filter((input) => input.type !== 'file').length % 2 === 0 && style.last_full}` }>
            {
              inputs?.filter((input) => input.type !== 'file').map((input, i) => (
                <div key={ i } className={ `${style.input} ${input.full && style.full_width}` }>
                  <a>{ input.title } { input.required && <span>*</span> }</a>
                  {
                    input.type === 'select' ? (
                      <Components.select
                        id={ input.id }
                        values={ values && setValues ? values : payload }
                        setValues={ values && setValues ? setValues : setPayload }

                        icon={ 'fa-regular ' + input.icon }
                        placeholder={ input.placeholder }
                        options={ input.options }
                        disabled={ input.disabled }
                      />
                    ) : (
                      <Components.input
                        id={ input.id }
                        values={ values && setValues ? values : payload }
                        setValues={ values && setValues ? setValues : setPayload }

                        type={ input.type }
                        icon={ 'fa-regular ' + input.icon }
                        placeholder={ input.placeholder }
                        disabled={ input.disabled }
                        autoComplete={ input.autoComplete }
                      />
                    )
                  }
                </div>
              ))
            }
          </div>
        </div>

        <div className={ style.buttons }>
          {
            buttons?.filter((r) => r.color).map((button, i) => (
              <div key={ i + '_button' } className={ style.button }>
                <Components.button 
                  icon={ button.icon }
                  text={ button.text }
                  color={ button.color }
                  onClick={ () => button.onClick(values && setValues ? values : payload) }
                />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Component;