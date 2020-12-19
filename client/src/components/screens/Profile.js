import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/userContext';

const Profile = () => {
  const [myPics, setMyPics] = useState([]);
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

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          margin: '18px 0px',
          borderBottom: '1px solid grey',
        }}
      >
        <div>
          <img
            src={state ? state.profilePicture : 'Loading...'}
            alt={state ? state.name : 'Loading...'}
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
