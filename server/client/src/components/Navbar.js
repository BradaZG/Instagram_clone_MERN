import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../context/userContext';
import { CLEAR } from '../context/userTypes';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to='/profile'>Profile</Link>
        </li>,
        <li>
          <Link to='/create'>Create Post</Link>
        </li>,
        <li>
          <Link to='/subscribedusersposts'>Following</Link>
        </li>,
        <li>
          <button
            className='btn #c62828 red darken-3'
            type='submit'
            onClick={() => {
              localStorage.clear();
              dispatch({ type: CLEAR });
              history.push('/signin');
            }}
          >
            LOGOUT
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to='/signin'>SignIn</Link>
        </li>,
        <li>
          <Link to='/signup'>SignUp</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className='nav-wrapper white'>
        <Link to={state ? '/' : '/signin'} className='brand-logo left'>
          Instagram
        </Link>
        <ul id='nav-mobile' className='right'>
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;