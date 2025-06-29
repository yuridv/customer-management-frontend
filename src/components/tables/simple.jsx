const Component = ({ style = {}, columns, list, actions, history, users }) => {
  const visibleColumns = window.innerWidth <= 768 ? columns.filter((c) => c.mobile) : columns;

  const formatValue = (value, type) => {
    if (!value) return 'Não definido...';
    if (type === 'cpf') return String(value).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (type === 'phone') return String(value).replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    if (type === 'date' || type === 'datetime') {
      const date = new Date(value);
      date.setHours(date.getHours() - 3);
      if (type === 'date') return date.toISOString().split('T')[0].split('-').reverse().join('/');
      if (type === 'datetime') return date.toISOString().split('T')[0].split('-').reverse().join('/') + ' ' + date.toISOString().split('T')[1].split(':').filter((_, i) => i <= 1).join(':');
    }
    return value;
  };

  const getWidth = (column) => {
    const width = window.innerWidth <= 768 && column.mobile ? column.mobile : column.width;
    const gap = ((visibleColumns.length - 1) * 10) / visibleColumns.length;
    return `calc(${width}% - ${gap}px)`;
  };

  return (
    <div className={` ${style.container} ${history && style.history} `}>
      <div className={style.title}>
        {visibleColumns?.map((column, i) => (
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
          list?.map((item, i) => (
            <div key={i} className={`${style.item} ${i % 2 === 0 ? style.color : ''}`}>
              {visibleColumns?.map((column, i2) => {
                if (column.id.includes('.')) {
                  item[column.id] = column.id.split('.').reduce((acc, key) => acc?.[key], item);
                }

                let value;
                if (column.id === 'vendedor') {
                  const vendedor = users.find(u => u._id === item.user);
                  value = vendedor ? vendedor.name : 'Desconhecido';
                } else {
                  value = formatValue(item[column.id], column.type);
                }

                const styleItem = {
                  width: getWidth(column),
                  textAlign: column.center ? 'center' : undefined,
                  display: column.center ? 'flex' : undefined,
                  justifyContent: column.center ? 'center' : undefined
                };

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
                        actions?.map((action, i3) => (
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