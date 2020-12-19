import { CLEAR, UPDATE, UPDATE_PICTURE, USER } from './userTypes';

const UserReducer = (state, action) => {
  switch (action.type) {
    case USER:
      return action.payload;
    case CLEAR:
      return null;
    case UPDATE:
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case UPDATE_PICTURE:
      return { ...state, profilePicture: action.payload };
    default:
      return state;
  }
};

export default UserReducer;
