import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/userContext';
import M from 'materialize-css';
import { UPDATE_PICTURE } from '../../context/userTypes';

const Profile = () => {
  const [myPics, setMyPics] = useState([]);
  const [image, setImage] = useState('');
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch('/myposts', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => setMyPics(result.myPosts));
  }, []);

  useEffect(() => {
    if (image) {
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
          fetch('/updatepicture', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
              profilePicture: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              M.Toast.dismissAll();
              localStorage.setItem(
                'user',
                JSON.stringify({
                  ...state,
                  profilePicture: result.profilePicture,
                })
              );
              dispatch({
                type: UPDATE_PICTURE,
                payload: result.profilePicture,
              });
              M.toast({
                html: 'Picture updated!',
                classes: '#43a047 green darken-1',
              });
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div
        style={{
          margin: '18px 0px',
          borderBottom: '1px solid grey',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <img
              src={state && state.profilePicture}
              alt={state && state.name}
              style={{ width: '160px', height: '160px', borderRadius: '80px' }}
            />
          </div>
          <div>
            <h4>{state ? state.name : 'Loading...'}</h4>
            <h5>{state ? state.email : 'Loading...'}</h5>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '108%',
              }}
            >
              <h6>{myPics.length} posts</h6>
              <h6>{state ? state.followers.length : 0} followers</h6>
              <h6>{state ? state.following.length : 0} following</h6>
            </div>
          </div>
        </div>
        <div
          className='file-field input-field'
          style={{ marginTop: '5px', marginBottom: '5px' }}
        >
          <div className='btn #64b5f6 blue darken-1'>
            <span>UPDATE PICTURE</span>
            <input
              type='file'
              onChange={(e) => {
                updatePhoto(e.target.files[0]);
              }}
            />
          </div>
          <div
            className='file-path-wrapper input-field'
            style={{ marginTop: '0', marginBottom: '0' }}
          >
            <input className='file-path validate' type='text' />
          </div>
        </div>
      </div>
      <div className='gallery'>
        {myPics.map((item) => (
          <img
            key={item._id}
            className='item'
            src={item.photo}
            alt={item.title}
            style={{ width: '160px', height: '160px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
