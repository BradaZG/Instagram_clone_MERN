import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');

  const postData = () => {
    fetch('/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
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
          M.toast({ html: data.message, classes: '#43a047 green darken-1' });
          history.push('/signin');
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
        <button
          className='btn #64b5f6 blue darken-1'
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            postData();
          }}
        >
          RESET PASSWORD
        </button>
      </div>
    </form>
  );
};

export default Reset;
