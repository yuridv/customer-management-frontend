import profile from '../../assets/images/profile.png';

const Component = ({ style = {}, columns, list, actions }) => {
  const isMobile = window.innerWidth <= 768;
  const visibleColumns = isMobile ? columns.filter((c) => c.mobile) : columns;

  const formatValue = (value, type) => {
    if (!value) {
      if (type === 'avatar') return profile;
      return 'Não definido...';
    }
    if (type === 'cpf') return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (type === 'phone') return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    if (type === 'date') {
      const date = new Date(value);
      date.setHours(date.getHours() - 3);
      return date.toISOString().split('T')[0].split('-').reverse().join('/');
    }
    return value;
  };

  const getWidth = (column) => {
    const width = isMobile && column.mobile ? column.mobile : column.width;
    const gap = ((visibleColumns.length - 1) * 10) / visibleColumns.length;
    return `calc(${width}% - ${gap}px)`;
  };

  return (
    <div className={style.container}>
      <div className={style.title}>
        {visibleColumns.map((column, i) => (
          <a
            key={i}
            style={{
              width: getWidth(column),
              textAlign: column.center ? 'center' : undefined
            }}
          >
            {column.label}
          </a>
        ))}
      </div>

      <div className={style.list}>
        {!list ? (
          <div className={style.loading}>
            <i className="fa-solid fa-spinner fa-spin" />
          </div>
        ) : (
          list.map((item, i) => (
            <div key={i} className={`${style.item} ${i % 2 === 0 ? style.color : ''}`}>
              {visibleColumns.map((column, i2) => {
                if (column.id.includes('.')) {
                  item[column.id] = column.id.split('.').reduce((acc, key) => acc?.[key], item);
                }

                const value = formatValue(item[column.id], column.type);

                const styleItem = {
                  width: getWidth(column),
                  textAlign: column.center ? 'center' : undefined,
                  display: column.center ? 'flex' : undefined,
                  justifyContent: column.center ? 'center' : undefined
                };

                if (column.type === 'avatar') {
                  return (
                    <div key={i2} style={ styleItem }>
                      <img src={ value }/>
                    </div>
                  );
                }

                if (column.options && column.options[item[column.id]]) {
                  const opt = column.options[item[column.id]];
                  return (
                    <div key={i2} style={styleItem}>
                      <a
                        style={{
                          background: opt.color,
                          borderRadius: '1vh',
                          paddingInline: '1vh',
                          paddingBlock: '0.5vh'
                        }}
                      >
                        {opt.value}
                      </a>
                    </div>
                  );
                }

                if (column.id === 'actions' && !item[column.id]) {
                  return (
                    <div key={i2} style={styleItem} className={style.actions}>
                      { 
                        actions.map((action, i3) => (
                          <i key={i3} className={action.icon} onClick={() => action.onClick(item._id)} />
                        ))
                      }
                    </div>
                  );
                }

                return (
                  <a key={i2} style={styleItem}>
                    {value}
                  </a>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default Component;