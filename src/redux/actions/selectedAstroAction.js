import {ActionTypes} from '../typeConstants/typeConstants'

export const setSelectedAstro = (value)=>{
    return {
        type:ActionTypes.SET_SELECTED_ASTRO,
        selectedAstro:value
    }
}