import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../context/userContext';
import { CLEAR } from '../context/userTypes';
import M from 'materialize-css';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li key='1'>
          <i
            data-target='modal1'
            className='large material-icons modal-trigger'
            style={{ color: 'black' }}
          >
            search
          </i>
        </li>,
        <li key='2'>
          <Link to='/profile'>Profile</Link>
        </li>,
        <li key='3'>
          <Link to='/create'>Create Post</Link>
        </li>,
        <li key='4'>
          <Link to='/subscribedusersposts'>Following</Link>
        </li>,
        <li key='5'>
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
        <li key='6'>
          <Link to='/signin'>SignIn</Link>
        </li>,
        <li key='7'>
          <Link to='/signup'>SignUp</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    if (query) {
      fetch('/searchusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          setUserDetails(results.user);
        });
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
      <div
        id='modal1'
        className='modal'
        ref={searchModal}
        style={{ color: 'black' }}
      >
        <div className='modal-content input-field'>
          <input
            type='text'
            placeholder='Search users'
            value={search}
            style={{ borderBottom: '1px solid #9e9e9e' }}
            onChange={(e) => {
              fetchUsers(e.target.value);
              if (!e.target.value) {
                setUserDetails([]);
              }
            }}
          />
          <ul className='collection' style={{ border: 0 }}>
            {userDetails.map((item) => {
              return (
                <Link
                  key={item._id}
                  to={
                    item._id !== state._id ? '/profile/' + item._id : '/profile'
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch('');
                    setUserDetails([]);
                  }}
                >
                  <li className='collection-item'>{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className='modal-footer'>
          <button
            className='modal-close btn #c62828 red darken-3'
            style={{ margin: '0px 0px 10px 0px' }}
            onClick={() => {
              setSearch('');
              setUserDetails([]);
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
