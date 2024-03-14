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
import { useAddDeviceInstallation, } from 'src/api/device-installation'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import moment from "moment";
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";

const DeviceInstallationAddSchema = Yup.object().shape({

    id_location: Yup.object().shape({
        label: Yup.string().required('Location is required'),
        value: Yup.string().required('Location is required')
    }),

    installation_order_number: Yup.string().required('Installation order name is required'),

    installed_by: Yup.string().required('Installed by is required'),

    installation_note: Yup.string().required('Installation notes is required'),

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


    calibration_date_expiry: Yup.string()
                        .required("Calibration expiry date is required")
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

const DeviceInstallationAddModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const {data: boundarySelectList, status: boundarySelectListStatus} = useGetBoundarySelectList(false)
    const [deviceInstallationData, setDeviceInstallationData] = useState(null)
    const mutationAddDeviceInstallation = useAddDeviceInstallation((oldData, newData) => [...oldData, newData], initialValues.id_device)

    useEffect(() => {  
        setToggleModal(modalName === "addDeviceInstallationModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: deviceInstallationData? deviceInstallationData : initialValues,
            validationSchema: DeviceInstallationAddSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                try {
                    values.id_location = values.id_location.value
                    await mutationAddDeviceInstallation.mutateAsync(values)
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Device Installation Added Successfully");
                            setSubmitting(false)          
                            setDeviceInstallationData(null)             
                            dispatch({type:"CLOSE_MODAL"})
                        }
                    })
                  } catch (e) {
                    setSubmitting(false)
                    setDeviceInstallationData(copyOfValues)
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
                        <CLabel htmlFor="text-input">Device Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.device_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Installation Location</CLabel>
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
                        <CLabel htmlFor="text-input">Installation Order Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="installation_order_number"
                        name="installation_order_number"
                        placeholder="Installation Name"
                        valid={!errors.installation_order_number && !!values.installation_order_number}
                        invalid={touched.installation_order_number && !!errors.installation_order_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.installation_order_number || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.installation_order_number}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Intalled By</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="installed_by"
                        name="installed_by"
                        placeholder="Installed by"
                        valid={!errors.installed_by && !!values.installed_by}
                        invalid={touched.installed_by && !!errors.installed_by}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.installed_by || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.installed_by}</CFormText>
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
                        <CLabel htmlFor="text-input">Installation Note</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <CTextarea 
                            id="installation_note"
                            name="installation_note"
                            placeholder="Installation Note"
                            valid={!errors.installation_note && !!values.installation_note}
                            invalid={touched.installation_note && !!errors.installation_note}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.installation_note || ''}
                            disabled={isSubmitting}
                            row={2}
                        />
                        <CFormText color="danger">{errors.installation_note}</CFormText>
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Calibration Date Expiry</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <Datetime 
                        id="calibration_date_expiry"
                        name="calibration_date_expiry"
                        placeholder="Calibration Date Expiry"
                        timeFormat={false}
                        dateFormat={DATE_ISO8601_NO_TIME}
                        inputProps={{placeholder: "Calibration Date Expiry"}}
                        valid={!errors.calibration_date_expiry && !!values.calibration_date_expiry}
                        invalid={touched.calibration_date_expiry && !!errors.calibration_date_expiry}
                        onChange={(value) => setFieldValue("calibration_date_expiry", 
                            moment(value, "YYYY-MM-DD", true).isValid() ? value.format(DATE_ISO8601_NO_TIME) : value
                        )}
                        value={values.calibration_date_expiry || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.calibration_date_expiry}</CFormText>
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
            Add New Device Installation
        </CModalHeader>
        <CModalBody>
            <UserModalForm ref={formRef}/>
        </CModalBody>
        <CModalFooter>
            <CButton 
                disabled={isSubmitting}
                color="info" 
                onClick={() => formRef.current.submitForm()} >
                        Submit  
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

export default DeviceInstallationAddModal;