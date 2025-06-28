import React, { useEffect } from 'react'
import { setEditMOde } from '../../../redux/actions/editModeAction';
import { useDispatch } from 'react-redux';

const Settings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
  }, [])

  
  return (
    <div>Settings</div>
  )
}

export default Settings