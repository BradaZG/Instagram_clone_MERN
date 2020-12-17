import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (url) {
      fetch('/createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          title,
          body,
          photo: url,
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
            M.Toast.dismissAll();
            M.toast({
              html: 'Post created successfully!',
              classes: '#43a047 green darken-1',
            });
            history.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url, title, body, history]);

  const postDetails = () => {
    if (title && body && image) {
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
    } else {
      M.toast({
        html: 'All fields are required...',
        classes: '#c62828 red darken-3',
      });
    }
  };

  return (
    <div
      className='card input-field'
      style={{
        margin: '30px auto',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='Body'
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className='file-field input-field'>
        <div className='btn #64b5f6 blue darken-1'>
          <span>Upload Image</span>
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
        onClick={() => postDetails()}
      >
        Submit post
      </button>
    </div>
  );
};

export default CreatePost;
