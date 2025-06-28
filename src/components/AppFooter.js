import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <CFooter>
      <div>
        <span className='text-primary'>
          Yashoda
        </span>
        <span className="ms-1">&copy; {year} </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <span className='text-primary'>
        Yashoda
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
