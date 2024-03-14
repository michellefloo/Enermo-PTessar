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
import { useDeleteBoundary} from '../../../../api/boundary'
import { toast } from 'react-toastify';


const BoundaryDeleteModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationDeleteUser = useDeleteBoundary((oldData, obj) =>  oldData.filter((item) => item.id !== obj.id))

    useEffect(() => {  
        setToggleModal(modalName === "deleteBoundaryModal")
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
                            toast.success("Boundary Deleted Successfully");
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
                        <CLabel htmlFor="text-input">Boundary code</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.location_code}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.location_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Customer</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.customer? values.customer.name : "-"}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Parent</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.parents? values.parents : "-"}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Description</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.location_desc}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Type</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.location_type}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Height</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.location_height}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Square Meter</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.location_square_meter}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol xs="12" md="12" className={"text-danger font-weight-bold"}>
                        Are you sure to delete this boundary?
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
            Delete Boundary
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

export default BoundaryDeleteModal;