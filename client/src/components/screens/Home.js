import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/userContext';

const Home = () => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState('');
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch('/allposts', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch('/like', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => item._id !== result._id);
        setData(newData);
      });
  };

  const deleteComment = (commentId, postId) => {
    fetch('/deletecomment', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        commentId: commentId,
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='home'>
      {data &&
        data.map((item) => {
          return (
            <div key={item._id} className='card home-card'>
              <h5
                style={{
                  padding: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {item.postedBy.name}
                {item.postedBy._id === state._id && (
                  <i
                    className='material-icons'
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
              <div className='card-image'>
                <img src={item.photo} alt={item.title} />
              </div>
              <div className='card-content'>
                <i className='material-icons' style={{ color: 'red' }}>
                  favorite
                </i>
                {item.likes.includes(state._id) ? (
                  <i
                    className='material-icons'
                    onClick={() => unlikePost(item._id)}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className='material-icons'
                    onClick={() => likePost(item._id)}
                  >
                    thumb_up
                  </i>
                )}
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((comment) => (
                  <h6 key={comment._id}>
                    <span style={{ fontWeight: '500' }}>
                      {comment.postedBy.name}
                    </span>{' '}
                    {comment.text}
                    {comment.postedBy._id === state._id && (
                      <i
                        style={{ float: 'right' }}
                        className='material-icons'
                        onClick={() => deleteComment(comment._id, item._id)}
                      >
                        delete
                      </i>
                    )}
                  </h6>
                ))}
                <form
                  className='input-field'
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                    setComment('');
                  }}
                >
                  <input
                    type='text'
                    value={comment}
                    placeholder='Add a comment...'
                    onChange={(e) => setComment(e.target.value)}
                  />
                </form>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Home;
