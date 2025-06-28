import { USER_LOGIN_MODE } from './constants';

const initialState = {
    value: null,
}

export const userInfo = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_MODE:
            // console.log("reducer called", action);
            return action.value;
        default:
            return state
    }
}
