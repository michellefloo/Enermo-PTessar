import React, {useRef, useState, useEffect} from "react";
import { CModal, CModalBody, CModalFooter, CModalHeader,
    CButton, CFormGroup, CLabel, CCol, CInput, CFormText
} from '@coreui/react';
import { Formik } from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateStatus } from "../../../../api/user-management";
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const DeleteAccountModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationDeleteUser = useUpdateStatus((oldData, newData) => [...oldData, newData])

    const DeleteAccountSchema = Yup.object().shape({
        retypeemail: Yup.string()
            .required('Please retype the email')
            .oneOf([initialValues.email], 'The email do not match.'),
    })

    useEffect(() => {  
        setToggleModal(modalName === "deleteAccountModal")
    }, [modalName])

    const UserModalForm = () => {
        return(
            <Formik 
                innerRef={formRef}
                initialValues={initialValues}
                onSubmit={async (values, { resetForm}) => {
                    setSubmitting(true)
                    try {
                        await mutationDeleteUser.mutateAsync({
                            email: values.retypeemail,
                            id: initialValues.id,
                            status: 2
                        }).then((res) => {
                            if(res.status === 200){
                                toast.success("User Deleted Successfully");
                                setSubmitting(false)
                                dispatch({type:"CLOSE_MODAL"})
                            }
                        })
                      } catch (e) {
                        setSubmitting(false)
                        toast.error(e.response.data.message);
                    }
                }}
                validationSchema={DeleteAccountSchema}
                >
                {({
                values,errors,
                touched,handleBlur,
                handleChange,isSubmitting,
                }) => (
                    <form>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Name</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                {initialValues.first_name} {initialValues.last_name}
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">email</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                {initialValues.email}
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Phone</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                {initialValues.phone}
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="12" xs="12">
                                Do you want to delete this account ?
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol xs="12" md="12">
                                <CInput type="text"
                                        name="retypeemail"
                                        id="retypeemail"
                                        placeholder="Re-type/enter email address to delete the account"
                                        autoComplete="retypeemail"
                                        valid={!errors.retypeemail}
                                        invalid={touched.retypeemail && !!errors.retypeemail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.retypeemail || ""}
                                        disabled={isSubmitting}
                                        />
                                <CFormText color="danger">{errors.retypeemail}</CFormText>
                            </CCol>
                        </CFormGroup>
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
            Delete Account
        </CModalHeader>
        <CModalBody>
            <UserModalForm />
        </CModalBody>
        <CModalFooter>
            <CButton color="danger" disabled={isSubmitting} onClick={() =>  formRef.current.handleSubmit()} >Delete</CButton>{' '}
            <CButton color="warning" disabled={isSubmitting} onClick={() => dispatch({type:"CLOSE_MODAL"})}>Cancel</CButton>
        </CModalFooter>
        </CModal>
    )

}

export default DeleteAccountModal;