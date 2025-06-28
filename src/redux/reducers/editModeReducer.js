import { ActionTypes } from '../typeConstants/typeConstants'

const initialValue = { editModeVal: 0, responce: "" };
export const editMode = (state = initialValue, { type, editMode }) => {
    switch (type) {
        case ActionTypes.EDIT_MODE:
            return editMode
        default:
            return state

    }
}