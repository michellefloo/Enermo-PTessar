import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, CTextarea,
        CInput, CFormText, CCol 
} from '@coreui/react';
import Select from 'react-select'
import Datetime from 'react-datetime'
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useGetBoundarySelectList } from "src/api/boundary";
import { useUpdateUtility, useGetUtilityTypeList,
            useGetUtilityUsageScheduleList,
            useGetUtilityResourceList } from 'src/api/utility'
import { useGetDeviceSelectList } from "src/api/device";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import moment from "moment";
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";

const UtilityEditSchema = Yup.object().shape({

    id_location: Yup.object().shape({
        label: Yup.string().required('Location is required'),
        value: Yup.string().required('Location is required')
    }),

    utility_name: Yup.string().required('Utility name is required'),

    utility_wattage: Yup.number().required('Utility wattage is required'),

    id_utility_type: Yup.object().shape({
        label: Yup.string().required('Utility type is required'),
        value: Yup.string().required('Utility type is required')
    }),

    id_usage_schedule: Yup.object().shape({
        label: Yup.string().required('Utility usage schedule is required'),
        value: Yup.string().required('Utility usage schedule is required')
    }),

    id_resource_usage_type: Yup.object().shape({
        label: Yup.string().required('Utility resource usage is required'),
        value: Yup.string().required('Utility resource usage is required')
    }),

    id_device: Yup.object().shape({
        label: Yup.string().required('Device is required'),
        value: Yup.string().required('Device is required')
    }),

    fabrication_date: Yup.string()
                        .required("Fabrication date is required")
                        .test(
                            "date validation",
                            "Invalid date or format. should be a valid YYYY-MM-DD format.",
                            val => {
                              if (!val) {
                                return true;
                              }
                              return moment(val, "YYYY-MM-DD", true).isValid();
                            }),

    installation_date: Yup.string()
                        .required("Installation date is required")
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

const UtilityEditModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const {data: boundarySelectList, status: boundarySelectListStatus} = useGetBoundarySelectList(false)
    const {data: utilityTypeSelectList, status: utilityTypeSelectListStatus} = useGetUtilityTypeList()
    const {data: utilityUsageScheduleSelectList, status: utilityUsageScheduleSelectListStatus} = useGetUtilityUsageScheduleList()
    const {data: utilityResourceSelectList, status: utilityResourceSelectListStatus} = useGetUtilityResourceList()
    const {data: deviceSelectList, status: deviceSelectListStatus} = useGetDeviceSelectList()
    const [utilityData, setUtilityData] = useState(null)
    const mutationUpdateUtility = useUpdateUtility((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "editUtilityModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: utilityData? utilityData : initialValues,
            validationSchema: UtilityEditSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                console.log(values)
                try {
                    values.id_location = values.id_location.value
                    values.id_utility_type = values.id_utility_type.value
                    values.id_resource_usage_type = values.id_resource_usage_type.value
                    values.id_usage_schedule = values.id_usage_schedule.value
                    values.id_device = values.id_device.value
                    await mutationUpdateUtility.mutateAsync(values)
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Utility Edited Successfully");
                            setSubmitting(false)          
                            setUtilityData(null)             
                            dispatch({type:"CLOSE_MODAL"})
                        }
                    })
                  } catch (e) {
                    setSubmitting(false)
                    setUtilityData(copyOfValues)
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
                        <CLabel htmlFor="text-input">Utility Location</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={boundarySelectListStatus !== "success"}
                            isClearable={false}
                            name="id_location"
                            id="id_location"
                            placeholder="Select Location"
                            options={boundarySelectList}
                            onChange={(value) => setFieldValue("id_location", value)}
                            onBlur={handleBlur}
                            value={values.id_location}
                            valid={!errors.id_location && !!values.id_location}
                            invalid={touched.id_location && !!errors.id_location}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_location? errors.id_location.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="utility_name"
                        name="utility_name"
                        placeholder="Utility Name"
                        valid={!errors.utility_name && !!values.utility_name}
                        invalid={touched.utility_name && !!errors.utility_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.utility_name || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.utility_name}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Description</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <CTextarea 
                            id="desc"
                            name="desc"
                            placeholder="Description"
                            valid={!errors.desc && !!values.desc}
                            invalid={touched.description && !!errors.desc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.desc || ''}
                            disabled={isSubmitting}
                            row={2}
                        />
                        <CFormText color="danger">{errors.desc}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Wattage</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="number"
                        id="utility_wattage"
                        name="utility_wattage"
                        placeholder="Utility Code"
                        valid={!errors.utility_wattage && !!values.utility_wattage}
                        invalid={touched.utility_wattage && !!errors.utility_wattage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.utility_wattage || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.utility_wattage}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Type</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={utilityTypeSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_utility_type"
                            id="id_utility_type"
                            placeholder="Select Utility Type"
                            options={utilityTypeSelectList}
                            onChange={(value) => setFieldValue("id_utility_type", value)}
                            onBlur={handleBlur}
                            value={values.id_utility_type}
                            valid={!errors.id_utility_type && !!values.id_utility_type}
                            invalid={touched.id_utility_type && !!errors.id_utility_type}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_utility_type? errors.id_utility_type.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Resource Usage</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={utilityResourceSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_resource_usage_type"
                            id="id_resource_usage_type"
                            placeholder="Select Utility Usage Schedule"
                            options={utilityResourceSelectList}
                            onChange={(value) => setFieldValue("id_resource_usage_type", value)}
                            onBlur={handleBlur}
                            value={values.id_resource_usage_type}
                            valid={!errors.id_resource_usage_type && !!values.id_resource_usage_type}
                            invalid={touched.id_resource_usage_type && !!errors.id_resource_usage_type}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_resource_usage_type? errors.id_resource_usage_type.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Utility Usage Schedule</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={utilityUsageScheduleSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_usage_schedule"
                            id="id_usage_schedule"
                            placeholder="Select Utility Usage Schedule"
                            options={utilityUsageScheduleSelectList}
                            onChange={(value) => setFieldValue("id_usage_schedule", value)}
                            onBlur={handleBlur}
                            value={values.id_usage_schedule}
                            valid={!errors.id_usage_schedule && !!values.id_usage_schedule}
                            invalid={touched.id_usage_schedule && !!errors.id_usage_schedule}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_usage_schedule? errors.id_usage_schedule.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Fabrication Date</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <Datetime 
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
                        <CLabel htmlFor="text-input">Installation Date</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <Datetime 
                        id="installation_date"
                        name="installation_date"
                        placeholder="Installation Date"
                        timeFormat={false}
                        dateFormat={DATE_ISO8601_NO_TIME}
                        inputProps={{placeholder: "Installation Date"}}
                        valid={!errors.installation_date && !!values.installation_date}
                        invalid={touched.installation_date && !!errors.installation_date}
                        onChange={(value) => setFieldValue("installation_date", 
                            moment(value, "YYYY-MM-DD", true).isValid() ? value.format(DATE_ISO8601_NO_TIME) : value
                        )}
                        value={values.installation_date || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.installation_date}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Monitored by Device</CLabel>
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
            Edit Utility
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

export default UtilityEditModal;