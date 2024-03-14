import React, {useRef, useState, useEffect} from "react";
import { CModal, CModalBody, CModalFooter, CModalHeader,
    CButton, CFormGroup, CLabel, CInput, CFormText, CCol 
} from '@coreui/react';
import Select from 'react-select'
import { USER_LEVELS_SELECTION } from "../../../../utils/constant";
import { Formik } from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useAddUserMan } from '../../../../api/user-management'
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const UserAddSchema = Yup.object().shape({
    email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
  
    password: Yup.string()
                  .min(6, "Password should be connsisting of min. 8 characters")
                  .required("Password is required"),
    
    retypePassword: Yup.string()
            .required('Please retype your password.')
            .oneOf([Yup.ref('password')], 'Your passwords do not match.'),

    first_name: Yup.string()
            .required('First name is required'),

    last_name: Yup.string()
            .required('Last name is required'),

    phone: Yup.string()
            .required('Phone is required'),
    
    id_level: Yup.object().shape({
        label: Yup.string().required('User Level is required'),
        value: Yup.string().required('User Level is required')
    })

});

const AddUserModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const [userManagementData, setUserManagementData] = useState(null)
    const mutationAddUser = useAddUserMan((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "addUserModal")
    }, [modalName])

    const UserModalForm = () => {
        return(
            <Formik 
                innerRef={formRef}
                initialValues={userManagementData? userManagementData : initialValues}
                onSubmit={async (values) => {
                    setSubmitting(true)
                    const copyOfValues = {...values}
                    try {
                        values.id_level = values.id_level.value
                        await mutationAddUser.mutateAsync({
                            ...values
                        }).then((res) => {
                            if(res.status === 200){
                                toast.success("User Added Successfully");
                                setSubmitting(false)
                                dispatch({type:"CLOSE_MODAL"})
                            }
                        })
                      } catch (e) {
                        setSubmitting(false)
                        setUserManagementData(copyOfValues)
                        toast.error(e.response.data.message);
                    }
                }}
                validationSchema={UserAddSchema}
            >
                {({
                    values,errors,
                    touched,setFieldValue,
                    handleBlur, handleChange,isSubmitting,
                }) => (
                    <form>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Email</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="text"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    autoComplete={false}
                                    valid={!errors.email}
                                    invalid={touched.email && !!errors.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email || ""}
                                    disabled={isSubmitting}
                                    />
                            <CFormText color="danger">{errors.email}</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">First Name</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="text"
                                    name="first_name"
                                    id="first_name"
                                    placeholder="First Name"
                                    autoComplete="first_name"
                                    valid={!errors.first_name}
                                    invalid={touched.first_name && !!errors.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.first_name || ""}
                                    disabled={isSubmitting}
                                    />
                            <CFormText color="danger">{errors.first_name}</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Last Name</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="text"
                                    name="last_name"
                                    id="last_name"
                                    placeholder="Last Name"
                                    autoComplete="last_name"
                                    valid={!errors.last_name}
                                    invalid={touched.last_name && !!errors.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.last_name || ""}
                                    disabled={isSubmitting}
                                    />
                            <CFormText color="danger">{errors.last_name}</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">User Level</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <Select
                                    isSearchable
                                    isClearable={false}
                                    name="id_level"
                                    id="id_level"
                                    placeholder="Select User Level"
                                    options={USER_LEVELS_SELECTION}
                                    onChange={(value) => setFieldValue("id_level", value)}
                                    onBlur={handleBlur}
                                    value={values.id_level}
                                    valid={!errors.id_level && !!values.id_level}
                                    invalid={touched.id_level && !!errors.id_level}
                                    disabled={isSubmitting}
                                />
                            <CFormText color="danger">{errors.id_level? errors.id_level.label : null}</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Password</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="password"
                                    name="password"
                                    id="password"
                                    placeholder=""
                                    autoComplete={false}
                                    valid={!errors.password}
                                    invalid={touched.password && !!errors.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password || ""}
                                    disabled={isSubmitting}
                                    />
                            <CFormText color="danger">{errors.password}</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Re-type Password</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="password"
                                    name="retypePassword"
                                    id="retypePassword"
                                    placeholder=""
                                    autoComplete={false}
                                    valid={!errors.retypePassword}
                                    invalid={touched.retypePassword && !!errors.retypePassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.retypePassword || ""}
                                    disabled={isSubmitting}
                                    />
                            <CFormText color="danger">{errors.retypePassword}</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="4" xs="4">
                                <CLabel htmlFor="text-input">Phone</CLabel>
                            </CCol>
                            <CCol xs="8" md="8">
                                <CInput type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="62 Code Required"
                                    autoComplete="phone"
                                    valid={!errors.phone}
                                    invalid={touched.phone && !!errors.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.phone || ""}
                                    disabled={isSubmitting}
                                    />
                            <CFormText color="danger">{errors.phone}</CFormText>
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
            Add New User
        </CModalHeader>
        <CModalBody>
            <UserModalForm />
        </CModalBody>
        <CModalFooter>
            <CButton color="info" disabled={isSubmitting} onClick={() => formRef.current.handleSubmit()} >Submit</CButton>{' '}
            <CButton color="warning" disabled={isSubmitting} onClick={() => dispatch({type:"CLOSE_MODAL"})}>Cancel</CButton>
        </CModalFooter>
        </CModal>
    )

}

export default AddUserModal;