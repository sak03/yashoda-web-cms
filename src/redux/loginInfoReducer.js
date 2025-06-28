import { USER_LOGIN_INFO } from './constants'

const initialState = {}

export const userLoginInfo = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_INFO:
            return action.value
        default:
            return state
    }
}