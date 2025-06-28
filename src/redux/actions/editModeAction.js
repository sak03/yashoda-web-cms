import {ActionTypes} from '../typeConstants/typeConstants'

export const setEditMOde = (value)=>{
    return{
        type:ActionTypes.EDIT_MODE,
        editMode:value
    }
}
