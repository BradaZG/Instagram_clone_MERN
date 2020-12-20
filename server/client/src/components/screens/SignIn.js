import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import UserContext from '../../context/userContext';

const SignIn = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const postData = () => {
    // if (
    //   !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //     email
    //   )
    // ) {
    //   M.toast({ html: 'Invalid email', classes: '#c62828 red darken-3' });
    //   return;
    // }

    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.error)) {
          data.error.map((error) =>
            M.toast({ html: error.msg, classes: '#c62828 red darken-3' })
          );
        } else if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' });
        } else {
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: 'USER', payload: data.user });
          M.toast({ html: 'Signed in!', classes: '#43a047 green darken-1' });
          history.push('/');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className='card__container'>
      <div className='card auth__card input-field'>
        <h2>Instagram</h2>
        <input
          type='email'
          value={email}
          placeholder='Enter email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          value={password}
          placeholder='Enter password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='btn #64b5f6 blue darken-1'
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            postData();
          }}
        >
          SIGN IN
        </button>
        <h6>
          <Link to='/signup'>Don't have an account?</Link>
        </h6>
      </div>
    </form>
  );
};

export default SignIn;
