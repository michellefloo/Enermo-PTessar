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
import { useDeleteDeviceGroup, } from 'src/api/device-group'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import moment from "moment";
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";

const DeleteDeviceGroup = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const [deviceRemovalData, setDeviceRemovalData] = useState(null)
    const mutationDeviceGroupDelete = useDeleteDeviceGroup((oldData, newData) => [...oldData, newData], initialValues.id_group)

    useEffect(() => {  
        setToggleModal(modalName === "deleteGroupModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: deviceRemovalData? deviceRemovalData : initialValues,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                try {
                    await mutationDeviceGroupDelete.mutateAsync({
                        id:values.id_group,
                    })
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Device Group Removed Successfully");
                            setSubmitting(false)          
                            setDeviceRemovalData(null)             
                            window.location.reload()
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
                        <CLabel htmlFor="text-input">Group Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.group_name}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Group Description</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {values.descriptions}
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
            Remove Device Group
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

export default DeleteDeviceGroup;