import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle, useContext} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, CTextarea,
        CInput, CFormText, CCol 
} from '@coreui/react';
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateDeviceGroup, useGetDeviceGroupList} from 'src/api/device-group'
import { useAddDeviceGroupDetail, useUpdateDeviceGroupDetail, 
            useDeleteDeviceGroupDetail, useGetDeviceGroupDetailList} from 'src/api/device-group-detail'
//useGetDeviceGroupDetailListByIdGroup
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DeviceDatable from "./DeviceDatatable"
import { isEqual } from 'lodash';
// import BigSpinner from "src/components/ui/big-spinner/BigSpinner";
import { GroupSelectContext } from '../../_provider/GroupSelectProvider'

const DeviceGroupEditSchema = Yup.object().shape({

    group_name: Yup.string().required('Group name is required'),
    group_description: Yup.string().required('Description is required'),

});

const DeviceGroupEditModal = () => {
    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    // const [selectedDeviceData, setSelectedDeviceData] = useState([])
    let selectedDeviceData = [] //LOL :D as long as it works
    const {data:deviceGroupData, status:deviceGroupStatus} = useGetDeviceGroupList()
    const [deviceInstallationData, setDeviceInstallationData] = useState(null)
    const { data:deviceGroupDetailData, status:deviceGroupDetailStatus } = useGetDeviceGroupDetailList()
    const mutationEditDeviceGroup= useUpdateDeviceGroup((oldData, newData) => [...oldData, newData])
    const mutationEditDeviceGroupDetail = useUpdateDeviceGroupDetail((oldData, newData) => [...oldData, newData], initialValues.id_group)
    const mutationAddDeviceGroupDetail = useAddDeviceGroupDetail((oldData, newData) => [...oldData, newData], initialValues.id_group)
    const mutationDeleteDeviceGroupDetail = useDeleteDeviceGroupDetail((oldData, newData) => [...oldData, newData], initialValues.id_group)
    // const { data:deviceGroupDetailData, status:deviceGroupDetailStatus } = useGetDeviceGroupDetailListByIdGroup(initialValues.id_group)
    const {deviceUponShow, setSelectedGroup} = useContext(GroupSelectContext)
    const [deviceDetailAfterFilter, setDeviceDetailAfterFilter] = useState([])

    useEffect(() => {  
        setToggleModal(modalName === "editGroupModal")
        if(deviceGroupDetailStatus === "success" 
            && deviceGroupStatus === "success"
            && deviceGroupData.result){
            let temp = []
            deviceGroupData.result.forEach(d => {
                temp.push(
                    ...deviceGroupDetailData.result.filter(dg => Number(dg.id_group_devices) === Number(d.id))
                )
            })
            setDeviceDetailAfterFilter(temp)
        }
}   , [modalName, deviceUponShow, deviceGroupDetailStatus, 
        deviceGroupDetailData, deviceGroupStatus, deviceGroupData
    ])

    // if(deviceGroupDetailStatus !== 'success'){
    //     return <BigSpinner />
    // }

    const handleOnDeviceSelect = (newState) => {
        if(!newState)
            return
        if(newState.length === 0)
            return
        if(isEqual(newState, selectedDeviceData))
            return
        selectedDeviceData= newState  //LOL :D as long as it works
    }

    const submitDeviceToGroupFactory = async (device) => {
        const deviceExistInGroup = deviceUponShow.find(d => d.id_devices === device.id)
        if(!deviceExistInGroup && device._checked){
            return await mutationAddDeviceGroupDetail.mutateAsync({
                id_devices: device.id,
                id_group_devices: initialValues.id_group
            })
        }
        // if(deviceExistInGroup && device._checked){
        //     console.log(device.device_desc, "EDIT")
        //     return await mutationEditDeviceGroupDetail.mutateAsync({
        //         id_devices: device.id,
        //         id_group_devices: initialValues.id_group 
        //     })
        // }
        // if(deviceExistInGroup && !device._checked){
        //     console.log(device.device_desc, "DELETE")
        //     return await mutationDeleteDeviceGroupDetail.mutateAsync({
        //         id: deviceExistInGroup.id
        //     })
        // }
    }

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: deviceInstallationData? deviceInstallationData : initialValues,
            validationSchema: DeviceGroupEditSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                try {
                    await mutationEditDeviceGroup.mutateAsync({
                        id:values.id_group,
                        group_name:values.group_name,
                        group_description:values.group_description
                    })
                    .then((res) => {
                        selectedDeviceData.forEach(async d => {
                            await submitDeviceToGroupFactory(d)
                                .then(res => {
                                    if(!res) return
                                    if(res.data.status === 200){
                                        toast.success("Device " + d.device_desc + " updated from/to Group");
                                    }
                                })
                                .catch(e => {
                                    toast.error(e.response.message);
                                })
                        })
                        if(res.status === 200){
                            toast.success("Device Group Edited Successfully");
                            setSubmitting(false)          
                            setDeviceInstallationData(null) 
                            setSelectedGroup(-1)           
                            dispatch({type:"CLOSE_MODAL"})
                            // window.location.reload()
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
                        <CLabel htmlFor="text-input">Group Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="group_name"
                        name="group_name"
                        placeholder="Group Name"
                        valid={!errors.group_name && !!values.group_name}
                        invalid={touched.group_name && !!errors.group_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.group_name || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.group_name}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Group Desc</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CTextarea 
                            id="group_description"
                            name="group_description"
                            placeholder="Description"
                            valid={!errors.group_description && !!values.group_description}
                            invalid={touched.group_description && !!errors.group_description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.group_description || ''}
                            disabled={isSubmitting}
                            row={2}
                        />
                    <CFormText color="danger">{errors.group_description}</CFormText>
                    </CCol>
                </CFormGroup> 
                {(deviceUponShow.length === 0) 
                    && (deviceGroupDetailStatus === 'success') 
                    && deviceGroupStatus === "success" &&
                    <CFormGroup row>
                        <CCol md="4" xs="4">
                            <CLabel htmlFor="text-input">Group Device(s)</CLabel>
                        </CCol>
                        <CCol xs="12" md="12">
                        <DeviceDatable onDeviceSelect={handleOnDeviceSelect} 
                                        // deviceUponShow={deviceUponShow}
                                        deviceGroupDetailData={deviceDetailAfterFilter}
                        />    
                        </CCol>
                    </CFormGroup> 
                }
            </CForm>
        )
    })
    
    return(
        <CModal 
            show={toggleStatus} 
            closeOnBackdrop={false}
            onClose={() => dispatch({type:"CLOSE_MODAL"})}
            size="xl"
        >
        <CModalHeader closeButton className="font-weight-bold">
            Edit Group
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

export default DeviceGroupEditModal;