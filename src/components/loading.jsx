import style from '../assets/css/components/loading.module.css';

const Component = () => {
  return (
    <div className={ style.container }>
      <i className='fa-solid fa-spinner fa-spin' />
    </div>
  );
};

export default Component;