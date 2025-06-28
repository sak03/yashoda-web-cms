import {USER_LOGIN_INFO} from './constants'

export const userLoginInfo = (value)=>{
    return {
        type : USER_LOGIN_INFO,
        value : value
    }
}