import React, { Fragment } from "react";
import CardButton from "src/components/ui/card-button/CardButton"
import { cilMoney } from '@coreui/icons'
import { useDispatch } from "react-redux";
import { useGetBudgetList } from "src/api/setting";
import BigSpinner from 'src/components/ui/big-spinner/BigSpinner'
const Budget = () => {
    const dispatch = useDispatch()
    const {data, status} = useGetBudgetList()
    if(status === 'loading') 
        return <BigSpinner text="Loading Budget..."/>
    return (
        <Fragment>
            <CardButton 
                text="Budget" 
                icon={cilMoney}
                onClick={() => dispatch({
                    type: 'CALL_MODAL',
                    modalName: 'budgetModal',
                    initialValues: data
                    })
                }
            />
        </Fragment>
    )
}
export default Budget