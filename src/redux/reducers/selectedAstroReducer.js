import { ActionTypes } from '../typeConstants/typeConstants'
const initialValue = null;

 export const selectedAstro = (state = initialValue, { type, selectedAstro }) => {
    switch (type) {
        case ActionTypes.SET_SELECTED_ASTRO:
            return selectedAstro
        default:
            return state
    }
}