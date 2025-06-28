import { ActionTypes } from '../typeConstants/typeConstants'

const initialValue = 0;

export const astroViewMove = (state = initialValue, { type, viewMode }) => {
    switch (type) {
        case ActionTypes.SET_ASTRO_VIEW_MODE:
            return viewMode
        default:
            return state
    }
}