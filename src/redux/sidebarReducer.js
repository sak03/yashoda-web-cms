import { SIDEBAR_SHOW } from './constants';

const initialState = {
    sidebarShow: true,
}

export const changeState = (state = initialState,  action) => {
    // console.log("sidebarReducer called", action.sidebarShow)
    switch (action.type) {
        case SIDEBAR_SHOW:
            return action.sidebarShow
        default:
            return state
    }
}
