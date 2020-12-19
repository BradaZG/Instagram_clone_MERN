import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
    // eslint-disable-next-line
  }, [url]);

  const uploadProfilePicture = () => {
    const imageData = new FormData();
    imageData.append('file', image);
    imageData.append('upload_preset', 'Instagram-clone');
    imageData.append('cloud_name', 'bradazg');
    M.toast({
      html: 'Uploading image. Please wait...',
      classes: '#43a047 green darken-1',
      displayLength: Infinity,
    });
    fetch('https://api.cloudinary.com/v1_1/bradazg/image/upload', {
      method: 'POST',
      body: imageData,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const uploadFields = () => {
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        profilePicture: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          data.error.map((error) =>
            M.toast({ html: error.msg, classes: '#c62828 red darken-3' })
          );
        } else {
          M.Toast.dismissAll();
          M.toast({ html: data.msg, classes: '#43a047 green darken-1' });
          history.push('/signin');
        }
      })
      .catch((err) => console.log(err));
  };

  const postData = () => {
    // if (
    //   !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //     email
    //   )
    // ) {
    //   M.toast({ html: 'Invalid email', classes: '#c62828 red darken-3' });
    //   return;
    // }
    if (image) {
      uploadProfilePicture();
    } else {
      uploadFields();
    }
  };

  return (
    <form className='card__container'>
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
        <div className='file-field input-field'>
          <div className='btn #64b5f6 blue darken-1'>
            <span>Upload Profile Picture</span>
            <input
              type='file'
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>
          <div className='file-path-wrapper input-field'>
            <input className='file-path validate' type='text' />
          </div>
        </div>
        <button
          className='btn #64b5f6 blue darken-1'
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            postData();
          }}
        >
          SIGN UP
        </button>
        <h6>
          <Link to='/signin'>Already have an account?</Link>
        </h6>
      </div>
    </form>
  );
};

export default SignUp;
