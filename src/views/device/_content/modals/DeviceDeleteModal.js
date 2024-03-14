import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, 
        CCol, CBadge
} from '@coreui/react';
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useDeleteDevice} from 'src/api/device'
import { toast } from 'react-toastify';

const DeviceEditModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationDeleteDevice = useDeleteDevice((oldData, obj) => oldData.filter((d) => d.id !== obj.id))

    useEffect(() => {  
        setToggleModal(modalName === "deleteDeviceModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: initialValues,
            onSubmit: async (values) => {
                setSubmitting(true)
                try {
                    await mutationDeleteDevice.mutateAsync({id: values.id})
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Device Deleted Successfully");
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
                        <CLabel htmlFor="text-input">Device Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.device_desc} &nbsp; {initialValues.is_main_panel? <CBadge color="info">Main Panel</CBadge> : null}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Device Code</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.device_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Device Serial Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.serial_number}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Device Fabricator</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.fabricator_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol xs="12" md="12" className={"text-danger font-weight-bold"}>
                        Are you sure to delete this device?
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
            Delete Device
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

export default DeviceEditModal;