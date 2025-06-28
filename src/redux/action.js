import {USER_LOGIN_MODE, SIDEBAR_SHOW} from './constants'

export const loginMode = (value)=>{
    // console.log("action caled", value)
    return {
        type:USER_LOGIN_MODE,
        value: value
    }
}

export const sidebarSow = (value)=>{
    // console.log("sidebarAction caled", value)
    return {
        type:SIDEBAR_SHOW,
        sidebarShow: value
    }
}