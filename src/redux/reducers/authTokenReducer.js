import { ActionTypes } from "../typeConstants/typeConstants";
const initialvalue = null;

export const AuthReduer = (state = initialvalue, { type, token, ...rest }) => {
  switch (type) {
    case ActionTypes.ADD_AUTHTOKEN:
      return { ...state, token };
    case ActionTypes.REMOVE_AUTHTOKEN:
      return { ...state, token };

    default:
      return state;
  }
};
