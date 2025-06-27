const Component = ({
  style = {},

  id,
  values,
  setValues,

  type,
  icon,
  placeholder,
  autoComplete,
  disabled
}) => {
  const onChange = (e) => setValues((prev) => ({ ...prev, [id]: e.target.value }));

  return (
    <div className={[ style.container, values[id] && style.selected ].join(' ')}>
      { icon && <i className={ icon } /> }

      <input
        defaultValue={ values[id] ?? '' }
        placeholder={ placeholder }
        type={ type }
        autoComplete={ autoComplete }
        disabled={ disabled }
        style={{ cursor: disabled ? 'not-allowed' : undefined }}
        onChange={ onChange }
      />
    </div>
  );
};

export default Component;