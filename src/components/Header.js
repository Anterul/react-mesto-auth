import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { NavLink, useLocation } from 'react-router-dom';

function Header(props) {
  const value = useContext(AppContext);
  const location = useLocation();

  if (value.state) {
    return(
      <header className="header">
        <div className="header__logo"></div>
        <div className="header__container">
          <p className="header__link">{props.email}</p>
          <button className="header__button" type="button" onClick={props.onSignOut}>
            Выйти
          </button>
        </div>
      </header>
    );
  } else {
    return(
      <header className="header">
      <div className="header__logo"></div>
      <div className="header__container">
        {
          location.pathname === '/sign-in' ?
          <NavLink className="header__link" to='/sign-up'>Регистрация</NavLink> :
          <NavLink className="header__link" to='/sign-in'>Войти</NavLink>
        }
      </div>
    </header>
    );  
  }
}

export default Header;