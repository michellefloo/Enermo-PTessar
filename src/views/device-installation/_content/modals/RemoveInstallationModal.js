import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, CTextarea,
        CInput, CFormText, CCol 
} from '@coreui/react';
import Datetime from 'react-datetime'
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useRemoveDeviceInstallation, } from 'src/api/device-installation'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import moment from "moment";
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";

const DeviceRemovalRemoveSchema = Yup.object().shape({

    removal_order_number: Yup.string().required('Removal order name is required'),

    removed_by: Yup.string().required('Removal by is required'),

    removal_note: Yup.string().required('Removal notes is required'),

    removal_date: Yup.string()
                        .required("Removal date is required")
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

const DeviceRemovalRemoveModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const [deviceRemovalData, setDeviceRemovalData] = useState(null)
    const mutationRemoveDeviceRemoval = useRemoveDeviceInstallation((oldData, newData) => [...oldData, newData], initialValues.id_device)

    useEffect(() => {  
        setToggleModal(modalName === "removeInstallationModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: deviceRemovalData? deviceRemovalData : initialValues,
            validationSchema: DeviceRemovalRemoveSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                try {
                    values.id_location = values.id_location.value
                    await mutationRemoveDeviceRemoval.mutateAsync({
                        id:values.id,
                        removal_date:values.removal_date,
                        removal_note:values.removal_note,
                        removal_order_number:values.removal_order_number,
                        removed_by:values.removed_by,
                    })
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Device Installation Removed Successfully");
                            setSubmitting(false)          
                            setDeviceRemovalData(null)             
                            dispatch({type:"CLOSE_MODAL"})
                        }
                    })
                  } catch (e) {
                    setSubmitting(false)
                    setDeviceRemovalData(copyOfValues)
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
                        {values.location_name}
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
                        <CLabel htmlFor="text-input">Removal Order Number</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="removal_order_number"
                        name="removal_order_number"
                        placeholder="Removal order number"
                        valid={!errors.removal_order_number && !!values.removal_order_number}
                        invalid={touched.removal_order_number && !!errors.removal_order_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.removal_order_number || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.removal_order_number}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Removed By</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="removed_by"
                        name="removed_by"
                        placeholder="Removed by"
                        valid={!errors.removed_by && !!values.removed_by}
                        invalid={touched.removed_by && !!errors.removed_by}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.removed_by || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.removed_by}</CFormText>
                    </CCol>
                </CFormGroup>  
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Removal Date</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <Datetime 
                        id="removal_date"
                        name="removal_date"
                        placeholder="Removal Date"
                        isValidDate={(current) => current.isSameOrAfter( values.installation_date )}
                        timeFormat={false}
                        dateFormat={DATE_ISO8601_NO_TIME}
                        inputProps={{placeholder: "Removal Date"}}
                        valid={!errors.removal_date && !!values.removal_date}
                        invalid={touched.removal_date && !!errors.removal_date}
                        onChange={(value) => setFieldValue("removal_date", 
                            moment(value, "YYYY-MM-DD", true).isValid() ? value.format(DATE_ISO8601_NO_TIME) : value
                        )}
                        value={values.removal_date || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.removal_date}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Removal Note</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <CTextarea 
                            id="removal_note"
                            name="removal_note"
                            placeholder="Removal Note"
                            valid={!errors.removal_note && !!values.removal_note}
                            invalid={touched.removal_noteription && !!errors.removal_note}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.removal_note || ''}
                            disabled={isSubmitting}
                            row={2}
                        />
                        <CFormText color="danger">{errors.removal_note}</CFormText>
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
            Remove Installed Device
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

export default DeviceRemovalRemoveModal;