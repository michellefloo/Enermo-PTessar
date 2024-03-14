import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, 
        CInput, CFormText, CCol 
} from '@coreui/react';
import Select from 'react-select'
import Datetime from 'react-datetime'
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateSensor, useGetSensorTypeSelectList, useGetSensorClassSelectList} from 'src/api/sensor'
import { useGetSensorFabricatorSelectList } from "src/api/fabricator";
import { useGetDeviceSelectList } from "src/api/device";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import moment from "moment";
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";

const SensorEditSchema = Yup.object().shape({

    sensor_name: Yup.string()
        .required('Sensor code is required'),

    sensor_code: Yup.string()
        .required('Sensor code is required'),

    serial_number: Yup.string().required('Serial number is required'),

    id_device: Yup.object().shape({
        label: Yup.string().required('Device is required'),
        value: Yup.string().required('Device is required')
    }),

    id_sensor_type: Yup.object().shape({
        label: Yup.string().required('Sensor type is required'),
        value: Yup.string().required('Sensor type is required')
    }),
    
    id_sensor_class: Yup.object().shape({
        label: Yup.string().required('Sensor class is required'),
        value: Yup.string().required('Sensor class is required')
    }),
    
    id_sensor_fabricator: Yup.object().shape({
        label: Yup.string().required('Fabricator is required'),
        value: Yup.string().required('Fabricator is required')
    }),

    max_measurement_cap: Yup.number().required('Max measurement cap is required'),

    fabrication_date: Yup.string()
                        .required('Fabrication date is required')
                        .test(
                            "date validation",
                            "Invalid date or format. should be a valid YYYY-MM-DD format.",
                            val => {
                              if (!val) {
                                return true;
                              }
                              return moment(val, "YYYY-MM-DD", true).isValid();
                            }),

});

const SensorEditModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const {data: fabricatorSelectList, status: fabricatorSelectListStatus} = useGetSensorFabricatorSelectList()
    const {data: deviceSelectList, status: deviceSelectListStatus} = useGetDeviceSelectList()
    const {data: sensorTypeSelectList, status: sensorTypeSelectListStatus} = useGetSensorTypeSelectList()
    const {data: sensorClassSelectList, status: sensorClassSelectListStatus} = useGetSensorClassSelectList()
    const mutationEditUser = useUpdateSensor((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "editSensorModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: initialValues,
            validationSchema: SensorEditSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                try {
                    values.id_sensor_type = values.id_sensor_type? values.id_sensor_type.value : null
                    values.id_sensor_class = values.id_sensor_class? values.id_sensor_class.value : null
                    values.id_sensor_fabricator = values.id_sensor_fabricator? values.id_sensor_fabricator.value : null
                    values.id_device = values.id_device? values.id_device.value : null
                    await mutationEditUser.mutateAsync({
                        id: values.id,
                        sensor_name: values.sensor_name,
                        sensor_code: values.sensor_code,
                        serial_number: values.serial_number,
                        id_device: values.id_device,
                        id_sensor_type: values.id_sensor_type,
                        id_sensor_class: values.id_sensor_class,
                        id_sensor_fabricator: values.id_sensor_fabricator,
                        max_measurement_cap: values.max_measurement_cap,
                        fabrication_date: values.fabrication_date,
                        fabrication_detail: values.fabrication_detail,
                    })
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Sensor Edited Successfully");
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
            values,errors,
            touched,setFieldValue,
            handleBlur,
            handleChange,
            isSubmitting,
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
                    <CInput 
                        type="text"
                        id="sensor_name"
                        name="sensor_name"
                        placeholder="Sensor Name"
                        valid={!errors.sensor_name && !!values.sensor_name}
                        invalid={touched.sensor_name && !!errors.sensor_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.sensor_name || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.sensor_name}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Code</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="sensor_code"
                        name="sensor_code"
                        placeholder="Sensor Code"
                        valid={!errors.sensor_code && !!values.sensor_code}
                        invalid={touched.sensor_code && !!errors.sensor_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.sensor_code || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.sensor_code}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Device</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={deviceSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_device"
                            id="id_device"
                            placeholder="Select Device"
                            options={deviceSelectList}
                            onChange={(value) => setFieldValue("id_device", value)}
                            onBlur={handleBlur}
                            value={values.id_device}
                            valid={!errors.id_device && !!values.id_device}
                            invalid={touched.id_device && !!errors.id_device}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_device? errors.id_device.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Type</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={sensorTypeSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_sensor_type"
                            id="id_sensor_type"
                            placeholder="Select Type"
                            options={sensorTypeSelectList}
                            onChange={(value) => setFieldValue("id_sensor_type", value)}
                            onBlur={handleBlur}
                            value={values.id_sensor_type}
                            valid={!errors.id_sensor_type && !!values.id_sensor_type}
                            invalid={touched.id_sensor_type && !!errors.id_sensor_type}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_sensor_type? errors.id_sensor_type.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Class</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={sensorClassSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_sensor_class"
                            id="id_sensor_class"
                            placeholder="Select Fabricator"
                            options={sensorClassSelectList}
                            onChange={(value) => setFieldValue("id_sensor_class", value)}
                            onBlur={handleBlur}
                            value={values.id_sensor_class}
                            valid={!errors.id_sensor_class && !!values.id_sensor_class}
                            invalid={touched.id_sensor_class && !!errors.id_sensor_class}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_sensor_class? errors.id_sensor_class.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Fabricator</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={fabricatorSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_sensor_fabricator"
                            id="id_sensor_fabricator"
                            placeholder="Select Fabricator"
                            options={fabricatorSelectList}
                            onChange={(value) => setFieldValue("id_sensor_fabricator", value)}
                            onBlur={handleBlur}
                            value={values.id_sensor_fabricator}
                            valid={!errors.id_sensor_fabricator && !!values.id_sensor_fabricator}
                            invalid={touched.id_sensor_fabricator && !!errors.id_sensor_fabricator}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_sensor_fabricator? errors.id_sensor_fabricator.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Sensor Serial Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        placeholder="Serial Number"
                        valid={!errors.serial_number && !!values.serial_number}
                        invalid={touched.serial_number && !!errors.serial_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.serial_number || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.serial_number}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Max Measurement Cap</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="max_measurement_cap"
                        name="max_measurement_cap"
                        placeholder="Max Measurement Cap"
                        valid={!errors.max_measurement_cap && !!values.max_measurement_cap}
                        invalid={touched.max_measurement_cap && !!errors.max_measurement_cap}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.max_measurement_cap || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.max_measurement_cap}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Fabrication Date</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <Datetime 
                        type="text"
                        id="fabrication_date"
                        name="fabrication_date"
                        placeholder="Fabrication Date"
                        timeFormat={false}
                        dateFormat={DATE_ISO8601_NO_TIME}
                        inputProps={{placeholder: "Fabrication Date"}}
                        valid={!errors.fabrication_date && !!values.fabrication_date}
                        invalid={touched.fabrication_date && !!errors.fabrication_date}
                        onChange={(value) => setFieldValue("fabrication_date", 
                            moment(value, "YYYY-MM-DD", true).isValid() ? value.format(DATE_ISO8601_NO_TIME) : value
                        )}
                        value={values.fabrication_date || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.fabrication_date}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Fabrication Detail</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="fabrication_detail"
                        name="fabrication_detail"
                        placeholder="Fabrication Detail"
                        valid={!errors.fabrication_detail && !!values.fabrication_detail}
                        invalid={touched.fabrication_detail && !!errors.fabrication_detail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.fabrication_detail || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.fabrication_detail}</CFormText>
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
            Edit New Sensor
        </CModalHeader>
        <CModalBody>
            <UserModalForm ref={formRef}/>
        </CModalBody>
        <CModalFooter>
            <CButton 
                disabled={isSubmitting}
                color="info" 
                onClick={() => formRef.current.submitForm()} >
                        Edit  
            </CButton>{'   '}
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

export default SensorEditModal;