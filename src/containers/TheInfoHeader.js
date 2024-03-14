import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import ConnectionErrorHandler from 'src/components/connection-error-handler/ConnectionErrorHandler'
import EmptyObjectErrorHandler from 'src/components/empty-object-error-handler/EmptyObjectHandler'

const TheInfoHeader = () => {
    const infoHeaderShow = useSelector(state => state.coreUiState.infoHeaderShow)
    const theObjectNotFound = useSelector(state => state.coreUiState.theObjectNotFound)
    return(
        <Fragment>
            {infoHeaderShow && !theObjectNotFound &&
                <div className="bg-white">
                    <ConnectionErrorHandler />
                </div>
            }
            {infoHeaderShow && theObjectNotFound &&
                <div className="bg-white">
                    <EmptyObjectErrorHandler />
                </div>
            }
        </Fragment>
    )
}

export default TheInfoHeader