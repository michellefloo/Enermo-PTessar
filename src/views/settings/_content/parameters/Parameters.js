import React, { Fragment } from "react";
import CardButton from "src/components/ui/card-button/CardButton"
import { cilEqualizer } from '@coreui/icons'
import { useDispatch } from "react-redux";
import { useGetParameterList } from "src/api/setting";
import BigSpinner from 'src/components/ui/big-spinner/BigSpinner'

const Parameter = () => {
    const dispatch = useDispatch()
    const {data, status} = useGetParameterList()
    if(status === 'loading') 
        return <BigSpinner text="Loading Parameter..."/>
    return (
        <Fragment>
            <CardButton 
                text="Parameter" 
                icon={cilEqualizer}
                onClick={() => dispatch({
                    type: 'CALL_MODAL',
                    modalName: 'parameterModal',
                    initialValues: data
                    })
                }
            />
        </Fragment>
    )
}
export default Parameter