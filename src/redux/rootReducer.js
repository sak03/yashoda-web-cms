import { combineReducers } from 'redux'
import { userInfo } from './reducer'
import { changeState } from './sidebarReducer'
import { userLoginInfo } from './loginInfoReducer'
import { astroViewMove } from '../redux/reducers/astroViewModeReducers'
import { selectedAstro } from '../redux/reducers/selectedAstroReducer'
import { AuthReduer } from '../redux/reducers/authTokenReducer'
import { editMode } from '../redux/reducers/editModeReducer'

export default combineReducers({
    userInfo,
    changeState,
    userLoginInfo,
    astroViewMove,
    selectedAstro,
    AuthReduer,
    editMode
})