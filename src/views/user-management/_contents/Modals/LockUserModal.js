import React, {useRef, useState, useEffect} from "react";
import { CModal, CModalBody, CModalFooter, CModalHeader,
    CButton, CFormGroup, CLabel, CCol
} from '@coreui/react';
import { Formik } from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateStatus } from '../../../../api/user-management'
import { toast } from 'react-toastify';

const LockUserModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues, callbackOnSuccess} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationUpdateStatus = useUpdateStatus((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "lockUserModal")
    }, [modalName])

    const UserModalForm = () => {
        return(
            <Formik 
                innerRef={formRef}
                initialValues={initialValues}
                onSubmit={async () => {
                    setSubmitting(true)
                    try {
                        await mutationUpdateStatus.mutateAsync({
                            email: initialValues.email,
                            id: initialValues.id,
                            status: initialValues.status === 1? 4 : 1
                        }).then((res) => {
                            if(res.status === 200){
                                toast.success("Successfull");
                                setSubmitting(false)
                                dispatch({type:"CLOSE_MODAL"})
                                if(callbackOnSuccess)
                                    callbackOnSuccess()
                            }
                        })
                      } catch (e) {
                        setSubmitting(false)
                        toast.error(e.response.data.message);
                    }
                }}
                >
                {props => (
                    <form>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Email :</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                {initialValues.email}
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Name :</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                {initialValues.first_name} {initialValues.last_name}
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Phone :</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                {initialValues.phone}
                            </CCol>
                        </CFormGroup>
                        Do you want to  {initialValues.status === 1? "lock" : "unlock"}  this account ?
                    </form>
                )}
            </Formik>
        )
    }

    return(
        <CModal 
            show={toggleStatus} 
            closeOnBackdrop={false}
            onClose={() => dispatch({type:"CLOSE_MODAL"})}
            size="lg"
        >
        <CModalHeader>
            {initialValues.status === 1? "Lock" : "Unlock"} Account
        </CModalHeader>
        <CModalBody>
            <UserModalForm />
        </CModalBody>
        <CModalFooter>
            <CButton color={initialValues.status === 1? "danger" : "info"} 
                    disabled={isSubmitting} onClick={() =>  formRef.current.handleSubmit()} >
                        {initialValues.status === 1? "Lock" : "Unlock"}    
                    </CButton>{' '}
            <CButton color="warning" disabled={isSubmitting} onClick={() => dispatch({type:"CLOSE_MODAL"})}>Cancel</CButton>
        </CModalFooter>
        </CModal>
    )

}

export default LockUserModal;