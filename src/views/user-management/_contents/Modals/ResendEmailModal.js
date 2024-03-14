import React, {useRef, useState, useEffect} from "react";
import { CModal, CModalBody, CModalFooter, CModalHeader,
    CButton, CFormGroup, CLabel, CCol, CInput, CFormText
} from '@coreui/react';
import { Formik } from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useResendEmail } from '../../../../api/user-management'
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const ResendEmailModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationResendEmail = useResendEmail(data => [...data])

    const ResendAccountEmailSchema = Yup.object().shape({
        resendEmail: Yup.string()
            .required('Please retype the email')
            .oneOf([initialValues.email], 'The email do not match.'),
    })

    useEffect(() => {  
        setToggleModal(modalName === "resendEmailModal")
    }, [modalName])

    const UserModalForm = () => {
        return(
            <Formik 
                innerRef={formRef}
                initialValues={initialValues}
                onSubmit={async (values) => {
                    setSubmitting(true)
                    try {
                        await mutationResendEmail.mutateAsync({
                            email: values.resendEmail,
                        }).then((res) => {
                            console.log(res)
                            if(res.status === 200){
                                toast.success("Resend Successfully");
                                setSubmitting(false)
                                dispatch({type:"CLOSE_MODAL"})
                            }
                        })
                      } catch (e) {
                        setSubmitting(false)
                        toast.error(e.response.data.message);
                    }
                }}
                validationSchema={ResendAccountEmailSchema}
                >
                {({
                values,errors,
                touched,handleBlur,
                handleChange,isSubmitting,
                }) => (
                    <form>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Re-Type Email Address</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="text"
                                        name="resendEmail"
                                        id="resendEmail"
                                        placeholder=""
                                        autoComplete="resendEmail"
                                        valid={!errors.resendEmail}
                                        invalid={touched.resendEmail && !!errors.resendEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.resendEmail || ""}
                                        disabled={isSubmitting}
                                        />
                                <CFormText color="danger">{errors.resendEmail}</CFormText>
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
            Lock Account
        </CModalHeader>
        <CModalBody>
            <UserModalForm />
        </CModalBody>
        <CModalFooter>
            <CButton color="info" disabled={isSubmitting} onClick={() =>  formRef.current.handleSubmit()} >Resend</CButton>{' '}
            <CButton color="warning" disabled={isSubmitting} onClick={() => dispatch({type:"CLOSE_MODAL"})}>Cancel</CButton>
        </CModalFooter>
        </CModal>
    )

}

export default ResendEmailModal;