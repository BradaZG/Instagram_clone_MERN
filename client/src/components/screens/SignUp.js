import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className='card__container'>
      <div className='card auth__card input-field'>
        <h2>Instagram</h2>
        <input type='text' placeholder='Enter name' />
        <input type='email' placeholder='Enter email' />
        <input type='password' placeholder='Enter password' />
        <button className='btn #64b5f6 blue darken-1' type='submit'>
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
