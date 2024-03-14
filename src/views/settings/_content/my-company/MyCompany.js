import React, { Fragment } from "react";
import CardButton from "src/components/ui/card-button/CardButton"
import { cilBuilding } from '@coreui/icons'
import { useDispatch } from "react-redux";
import { useGetUserCompanyList } from "src/api/user-management";
import BigSpinner from 'src/components/ui/big-spinner/BigSpinner'
const MyCompany = () => {
    const dispatch = useDispatch()
    const {data, status} = useGetUserCompanyList()
    if(status === 'loading') 
        return <BigSpinner text="Loading Company..."/>
    return (
        <Fragment>
            <CardButton 
                text="My Company" 
                icon={cilBuilding}
                onClick={() => dispatch({
                    type: 'CALL_MODAL',
                    modalName: 'myCompanyModal',
                    initialValues: {
                        address: data.company_address,
                        lat: data.lat,
                        lon: data.lon,
                        telp: data.telp
                    }
                    })
                }
            />
        </Fragment>
    )
}
export default MyCompany