import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel,
        CFormText, CCol 
} from '@coreui/react';
import Datetime from 'react-datetime'
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateDeviceInstallation } from 'src/api/device-installation'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import moment from "moment";
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";

const DeviceInstallationEditSchema = Yup.object().shape({

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

const DeviceInstallationEditModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const [deviceInstallationData, setDeviceInstallationData] = useState(null)
    const mutationEditDeviceInstallation = useUpdateDeviceInstallation((oldData, newData) => [...oldData, newData], initialValues.id_device)

    useEffect(() => {  
        setToggleModal(modalName === "editCalibrationModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: deviceInstallationData? deviceInstallationData : initialValues,
            validationSchema: DeviceInstallationEditSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                try {
                    await mutationEditDeviceInstallation.mutateAsync({
                        id: values.id,
                        calibration_date_expiry: values.calibration_date_expiry,
                    })
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Calibration Expiry Updated Successfully");
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
                        {values.location_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Installation Order Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.installation_order_number}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Installed By</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.installed_by}
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
                        <CLabel htmlFor="text-input">Current Calibration Date Expirye</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.curr_calibration_date_expiry}
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
                        placeholder="Fabrication Date"
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
            Edit Calibration Expiry Date
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

export default DeviceInstallationEditModal;