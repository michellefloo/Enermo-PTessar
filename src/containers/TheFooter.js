import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a href="https://x.automa.id" target="_blank" rel="noopener noreferrer">Sentra Solusi Automa</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
