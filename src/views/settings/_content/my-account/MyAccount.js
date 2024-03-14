import React, { Fragment } from "react";
import CardButton from "src/components/ui/card-button/CardButton"
import { cilUser } from '@coreui/icons'
import { useDispatch } from "react-redux";

const MyAccount = () => {
    const dispatch = useDispatch()
    return (
        <Fragment>
            <CardButton 
                text="My Account" 
                icon={cilUser}
                onClick={() => dispatch({
                    type: 'CALL_MODAL',
                    modalName: 'myAccountModal',
                    initialValues: {}
                    })
                }
            />
        </Fragment>
    )
}
export default MyAccount