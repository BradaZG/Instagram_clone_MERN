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
            src='https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
            alt=''
            style={{ width: '160px', height: '160px', borderRadius: '80px' }}
          />
        </div>
        <div>
          <h4>{state ? state.name : 'Loading...'}</h4>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '108%',
            }}
          >
            <h6>40 posts</h6>
            <h6>40 followers</h6>
            <h6>40 following</h6>
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
