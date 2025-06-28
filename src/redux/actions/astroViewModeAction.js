import {ActionTypes} from '../typeConstants/typeConstants'

export const setAstroViewMode = (value)=>{
    return{
        type:ActionTypes.SET_ASTRO_VIEW_MODE,
        viewMode:value
    }
}