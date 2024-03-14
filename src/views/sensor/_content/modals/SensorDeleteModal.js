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
import { useDeleteSensor} from 'src/api/sensor'
import { toast } from 'react-toastify';
import moment from "moment";
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";

const SensorDeleteModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const mutationDeleteUser = useDeleteSensor((oldData, obj) => oldData.filter(d => d.id !== obj.id))

    useEffect(() => {  
        setToggleModal(modalName === "deleteSensorModal")
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
                            toast.success("Sensor Deleted Successfully");
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
                        <CLabel htmlFor="text-input">Sensor Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.sensor_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Code</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.sensor_code}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Device</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.device_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Type</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.sensor_type}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Class</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.sensor_class}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Fabricator</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.sensor_fabricator}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Serial Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.serial_number}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Max Measurement Cap</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.max_measurement_cap}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Fabrication Date</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {moment(values.fabrication_date).format(DATE_ISO8601_NO_TIME)}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Fabrication Detail</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.fabrication_detail}
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol xs="12" md="12" className={"text-danger font-weight-bold"}>
                        Are you sure to delete this sensor?
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
            Delete New Sensor
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

export default SensorDeleteModal;