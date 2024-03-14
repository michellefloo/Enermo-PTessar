import React, {useRef, useState, useEffect} from "react";
import { CModal, CModalBody, CModalFooter, CModalHeader,
    CButton, CFormGroup, CLabel, CCol, CInput, CFormText
} from '@coreui/react';
import { Formik } from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdatePassword } from '../../../../api/user-management'
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const UserChangePasswordSchema = Yup.object().shape({

    new_password: Yup.string()
                  .min(6, "Password should be connsisting of min. 8 characters")
                  .required("Password is required"),
    
    confirm_new_password: Yup.string()
            .required('Please retype your password.')
            .oneOf([Yup.ref('new_password')], 'Your passwords do not match.'),

});

const ResetPasswordModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationUpdatePassword = useUpdatePassword((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "resetPasswordModal")
    }, [modalName])

    const UserModalForm = () => {
        return(
            <Formik 
                innerRef={formRef}
                initialValues={initialValues}
                onSubmit={(values) => {
                    setSubmitting(true)
                    try {
                        mutationUpdatePassword.mutateAsync({
                            email: initialValues.email,
                            new_password: values.new_password,
                            confirm_new_password: values.confirm_new_password
                        }).then((res) => {
                            if(res.status === 200){
                                toast.success("Password Changed Successfully");
                                setSubmitting(false)
                                dispatch({type:"CLOSE_MODAL"})
                            }
                        })
                      } catch (e) {
                        setSubmitting(false)
                        toast.error(e.response.data.message);
                    }
                }}
                validationSchema={UserChangePasswordSchema}
                >
                {({
                values,errors,
                touched,handleBlur,
                handleChange,isSubmitting,
                }) => (
                    <form>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Email</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                {initialValues.email}
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">New Password</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="password"
                                        name="new_password"
                                        id="new_password"
                                        placeholder=""
                                        autoComplete="new_password"
                                        valid={!errors.new_password}
                                        invalid={touched.new_password && !!errors.new_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.new_password || ""}
                                        disabled={isSubmitting}
                                        />
                               <CFormText color="danger">{errors.new_password}</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Confirmed New Password</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="password"
                                        name="confirm_new_password"
                                        id="confirm_new_password"
                                        placeholder=""
                                        autoComplete="confirm_new_password"
                                        valid={!errors.confirm_new_password}
                                        invalid={touched.confirm_new_password && !!errors.confirm_new_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.confirm_new_password || ""}
                                        disabled={isSubmitting}
                                        />
                               <CFormText color="danger">{errors.confirm_new_password}</CFormText>
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
        <CModalHeader >
            Reset Password
        </CModalHeader>
        <CModalBody>
            <UserModalForm />
        </CModalBody>
        <CModalFooter>
            <CButton color="info" disabled={isSubmitting} onClick={() =>  formRef.current.handleSubmit()} >Submit</CButton>{' '}
            <CButton color="warning" disabled={isSubmitting} onClick={() => dispatch({type:"CLOSE_MODAL"})}>Cancel</CButton>
        </CModalFooter>
        </CModal>
    )

}

export default ResetPasswordModal;