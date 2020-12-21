import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const { token } = useParams();
  console.log(token);
  const postData = () => {
    fetch('/newpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token,
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
          type='password'
          value={password}
          placeholder='Enter new password'
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
          UPDATE PASSWORD
        </button>
      </div>
    </form>
  );
};

export default NewPassword;
