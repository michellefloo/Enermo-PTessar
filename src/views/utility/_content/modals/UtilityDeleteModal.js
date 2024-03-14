import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, CCol 
} from '@coreui/react';
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useDeleteUtility } from 'src/api/utility'
import { toast } from 'react-toastify';

const UtilityDeleteModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationDeleteUtility = useDeleteUtility((oldData, obj) => oldData.filter(d => d.id !== obj.id))

    useEffect(() => {  
        setToggleModal(modalName === "deleteUtilityModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: initialValues,
            onSubmit: async (values) => {
                setSubmitting(true)
                try {
                    await mutationDeleteUtility.mutateAsync({id: values.id})
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Utility Deleted Successfully");
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
                        <CLabel htmlFor="text-input">Utility Location</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.location_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.utility_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Description</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.desc}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Wattage</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.utility_wattage}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Type</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.utility_type_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Resource Usage</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.resource_usage_type_name}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Usage Schedule</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.usage_schedule_name}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Fabrication Date</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.fabrication_date}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Installation Date</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.installation_date}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Monitored by Device</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.device_name}
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
            Delete Utility
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

export default UtilityDeleteModal;