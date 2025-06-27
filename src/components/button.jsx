import { useState } from 'react';

const colors = {
  'green': {
    background: 'linear-gradient(to bottom right, #00ff00, #38a838)',
    color: 'white',
    background_hover: 'linear-gradient(to bottom right, #38a838, #00ff00)',
    color_hover: 'black'
  },
  'red': {
    background: 'linear-gradient(to bottom right, #ff0000, #853535)',
    color: 'white',
    background_hover: 'linear-gradient(to bottom right, #853535, #ff0000)',
    color_hover: 'black'
  },
  'orange': {
    background: '#dcbc04',
    color: 'black',
    background_hover: 'rgb(188,156,4)',
    color_hover: 'white'
  }
};

const Component = ({ style = {}, text, icon, color, customStyle, onClick }) => {
  const [ hover, setHover ] = useState();
  const [ block, setBlock ] = useState();

  const Click = async() => {
    setBlock(true); 
    if (onClick) await onClick();
    setBlock();
  };
  
  return (
    <div 
      onClick={ Click }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover()}
      className={ [ style.button, block && style.block ].join(' ') } 
      style={{
        background: hover ? colors[color]?.background_hover : colors[color]?.background,
        color: hover ? colors[color]?.color_hover : colors[color]?.color,
        ...customStyle
      }}
    >
      { icon && <div className={ style.icon }><i className={ icon } /></div> }
      { text && <span>{ text }</span> }
      <i className="fa-duotone fa-spinner-third fa-spin" />
    </div>
  );
};

export default Component;