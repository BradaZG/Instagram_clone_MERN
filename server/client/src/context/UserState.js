import React, { useReducer } from 'react';
import UserContext from './userContext';
import UserReducer from './userReducer';

const initialState = null;

const UserState = (props) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
