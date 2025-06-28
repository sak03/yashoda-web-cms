import { ActionTypes } from "../typeConstants/typeConstants";

export const addAuthToken = (value) => {
    return {
        type: ActionTypes.ADD_AUTHTOKEN,
        token: value,
    }
}

export const removeAuthToken = (value) => {
    return {
        type: ActionTypes.REMOVE_AUTHTOKEN,
        token: value,
    }
}
