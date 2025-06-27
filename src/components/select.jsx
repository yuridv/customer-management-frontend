const Component = ({
  style = {},

  id,
  values,
  setValues,

  icon,
  placeholder,
  options,
  disabled
}) => {
  const onChange = (e) => setValues((prev) => ({ ...prev, [id]: e.target.value }));

  return (
    <div className={[ style.container, values[id] && style.selected ].join(' ')}>
      { icon && <i className={ icon } /> }

      <select
        onChange={ onChange }
        disabled={ disabled }
        value={ values[id] || '' }
        style={{
          cursor: disabled ? 'not-allowed' : undefined,
          color: !values[id] && 'gray'
        }}
      >
        <option value=''>{ placeholder || 'Selecione' }</option>
        {
          options?.map((item, i) => (
            <option key={ i } value={ item.value }>{ item.name }</option>
          ))
        }
      </select>


    </div>
  );
};

export default Component;