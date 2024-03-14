import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, 
        CInput, CFormText, CCol 
} from '@coreui/react';
import Select from 'react-select'
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateDevice} from 'src/api/device'
import { useGetFabricatorSelectList } from "src/api/fabricator";
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const DeviceEditSchema = Yup.object().shape({

    device_name: Yup.string()
        .required('Device code is required'),

    device_desc: Yup.string()
        .required('Device code is required'),

    serial_number: Yup.string().required('Serial number is required'),

    id_dev_fab: Yup.object().shape({
        label: Yup.string().required('Fabricator is required'),
        value: Yup.string().required('Fabricator is required')
    }),
    
});

const DeviceEditModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const {data: fabricatorSelectList, status: fabricatorSelectListStatus} = useGetFabricatorSelectList()
    const mutationEditUser = useUpdateDevice((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "editDeviceModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: initialValues,
            validationSchema: DeviceEditSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                try {
                    values.id_dev_fab = values.id_dev_fab? values.id_dev_fab.value : null
                    await mutationEditUser.mutateAsync(values)
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Device Edited Successfully");
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
                        <CLabel htmlFor="text-input">Device Code</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="device_name"
                        name="device_name"
                        placeholder="Device Name"
                        valid={!errors.device_name && !!values.device_name}
                        invalid={touched.device_name && !!errors.device_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.device_name || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.device_name}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Device Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="device_desc"
                        name="device_desc"
                        placeholder="Device Code"
                        valid={!errors.device_desc && !!values.device_desc}
                        invalid={touched.device_desc && !!errors.device_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.device_desc || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.device_desc}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row> 
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Is Main Panel</CLabel>
                    </CCol>
                    <CCol xs="1" md="1">
                    <CInput 
                        type="checkbox"
                        size="sm"
                        id="is_main_panel"
                        name="is_main_panel"
                        checked={values.is_main_panel === 1? true : false}
                        valid={!errors.is_main_panel && !!values.is_main_panel}
                        invalid={touched.is_main_panel && !!errors.is_main_panel}
                        onChange={(e) => setFieldValue("is_main_panel", e.target.checked? 1 : 0)}
                        onBlur={handleBlur}
                        value={values.is_main_panel || 0}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.is_main_panel}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Device Serial Number</CLabel>
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
                        <CLabel htmlFor="text-input">Device Fabricator</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={fabricatorSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_dev_fab"
                            id="id_dev_fab"
                            placeholder="Select Fabricator"
                            options={fabricatorSelectList}
                            onChange={(value) => setFieldValue("id_dev_fab", value)}
                            onBlur={handleBlur}
                            value={values.id_dev_fab}
                            valid={!errors.id_dev_fab && !!values.id_dev_fab}
                            invalid={touched.id_dev_fab && !!errors.id_dev_fab}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_dev_fab? errors.id_dev_fab.label : null
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
            Edit Device ({initialValues.device_name} - {initialValues.device_desc})
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

export default DeviceEditModal;