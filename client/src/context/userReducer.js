import { CLEAR, USER } from './userTypes';

const UserReducer = (state, action) => {
  switch (action.type) {
    case USER:
      return action.payload;
    case CLEAR:
      return null;
    default:
      return state;
  }
};

export default UserReducer;