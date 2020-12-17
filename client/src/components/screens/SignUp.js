import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState('');
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

    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          data.error.map((error) =>
            M.toast({ html: error.msg, classes: '#c62828 red darken-3' })
          );
        } else {
          M.toast({ html: data.msg, classes: '#43a047 green darken-1' });
          history.push('/signin');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='card__container'>
      <div className='card auth__card input-field'>
        <h2>Instagram</h2>
        <input
          type='text'
          value={name}
          placeholder='Enter name'
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={() => postData()}
        >
          SIGN UP
        </button>
        <h6>
          <Link to='/signin'>Already have an account?</Link>
        </h6>
      </div>
    </div>
  );
};

export default SignUp;
