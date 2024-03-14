import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, 
        CCol 
} from '@coreui/react';
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useDeleteCustomer } from 'src/api/customer'
import { toast } from 'react-toastify';

const CustomerDeleteModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationDeleteUser = useDeleteCustomer((oldData, obj) => oldData.filter(d => d.id !== obj.id))

    useEffect(() => {  
        setToggleModal(modalName === "deleteCustomerModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: initialValues,
            onSubmit: async (values) => {
                setSubmitting(true)
                try {
                    await mutationDeleteUser.mutateAsync({id: values.id})
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Customer Deleted Successfully");
                            setSubmitting(false)          
                            dispatch({type:"CLOSE_MODAL"})
                        }
                    })
                  } catch (e) {
                    setSubmitting(false)
                    toast.error(e.response.data.message);
                }
            },
          });
        const {
            values
        } = formik
        useImperativeHandle(ref, () => ({
            ...formik,
        }))
        return(
            <CForm>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Customer Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Latitude</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.lat}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Longitude</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.lng}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Main Address</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.main_address}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Phone</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.phone}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Fax Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.fax}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Whatsapp Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.handphone}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">PIC Finance Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.pic_finance}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">PIC Finance Email</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.pic_finance_email}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Description</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.description}
                    </CCol>
                </CFormGroup> 
            </CForm>
        )
    })
    
    return(
        <CModal 
            show={toggleStatus} 
            closeOnBackdrop={false}
            onClose={() => dispatch({type:"CLOSE_MODAL"})}
            size="lg"
        >
        <CModalHeader closeButton className="font-weight-bold">
            Delete Customer
        </CModalHeader>
        <CModalBody>
            <UserModalForm ref={formRef}/>
        </CModalBody>
        <CModalFooter>
            <CButton 
                disabled={isSubmitting}
                color="danger" 
                onClick={() => formRef.current.submitForm()} >
                        Delete  
            </CButton>{' '}
            <CButton 
                disabled={isSubmitting}
                color="warning" 
                onClick={() => dispatch({type:"CLOSE_MODAL"})}>
                        Cancel
            </CButton>
        </CModalFooter>
        </CModal>
    )

}

export default CustomerDeleteModal;