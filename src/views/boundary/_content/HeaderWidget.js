import React, { Fragment, useState, useEffect } from 'react'
import { useGetBoundaryList } from '../../../api/boundary'
import {
    CCol,
    CRow,
    CWidgetIcon,
    CSpinner
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'

  const BoundaryHeaderWidget = () => {
    const {data: rqData, status: rqStatus} = useGetBoundaryList()
    const [boundaryDataLength, setBoundaryDataLength] = useState('0')
    useEffect(() => {
        if(rqStatus === 'success'){
           if(!rqData) return
           if(!rqData.transformed) return
           const {transformed} = rqData
           setBoundaryDataLength(transformed.length.toString())
        }
    }, [rqData, rqStatus])
    return (
        <Fragment>
             <CRow>
                {rqStatus === "loading" && 
                    <CCol xs="12" sm="6" lg="4">
                        <CSpinner className="spinner spinner--spacer-bottom"
                            color="info" variant="grow"
                        />
                    </CCol>
                } 
                {rqStatus !== "loading" && 
                    <CCol xs="12" sm="6" lg="4">
                        <CWidgetIcon color="info" iconPadding={false}
                                    header={boundaryDataLength} text="boundaries" 
                                    className="font-size-large text-uppercase font-weight-bold"
                        >
                            <CIcon width={24} name="cil-layers"/>
                        </CWidgetIcon>
                    </CCol>
                }         
            </CRow>
        </Fragment>
    )
}

export default BoundaryHeaderWidget