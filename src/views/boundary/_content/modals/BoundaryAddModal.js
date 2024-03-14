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
import { useAddBoundary, useGetBoundarySelectList, useGetBoundaryTypeList } from '../../../../api/boundary'
import { useGetCustomerSelectList } from "src/api/customer";
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const BoundaryAddSchema = Yup.object().shape({

    location_code: Yup.string()
        .required('Boundary code is required'),

    location_name: Yup.string()
        .required('Boundary name is required'),

    id_main_customer: Yup.object().shape({
        label: Yup.string().required('Customer is required'),
        value: Yup.string().required('Customer is required')
    }),

    idParents: Yup.object().shape({
        label: Yup.string().required('Parent is required'),
        value: Yup.string().required('Parent is required')
    }),

    id_location_type: Yup.object().shape({
        label: Yup.string().required('Boundary type is required'),
        value: Yup.string().required('Boundary type  is required')
    }),

    location_height: Yup.number().required('Boundary height is required'),
    location_square_meter: Yup.number().required('Boundary square meter is required'),
    
});

const BoundaryAddModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const {data: boundarySelectList, status: boundarySelectListStatus} = useGetBoundarySelectList()
    const {data: customerSelectList, status: customerSelectListStatus} = useGetCustomerSelectList()
    const {data: boundaryTypeList, status: boundaryTypeListStatus} = useGetBoundaryTypeList()
    const mutationAddUser = useAddBoundary((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "addBoundaryModal")
    }, [modalName])

    const UserModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: initialValues,
            validationSchema: BoundaryAddSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                try {
                    values.idParents = values.idParents.value === -1 ? [null] : [values.idParents.value]
                    values.id_main_customer = values.id_main_customer.value
                    values.id_location_type = values.id_location_type.value
                    if(values.id_main_customer === -1)
                        delete values.id_main_customer
                    await mutationAddUser.mutateAsync(values)
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Boundary Added Successfully");
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
                        <CLabel htmlFor="text-input">Boundary code</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="location_code"
                        name="location_code"
                        placeholder="Boundary code"
                        valid={!errors.location_code && !!values.location_code}
                        invalid={touched.location_code && !!errors.location_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.location_code || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.location_code}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="location_name"
                        name="location_name"
                        placeholder="Boundary name"
                        valid={!errors.location_name && !!values.location_name}
                        invalid={touched.location_name && !!errors.location_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.location_name || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.location_name}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Customer</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={customerSelectListStatus !== "success"}
                            isClearable={false}
                            name="id_main_customer"
                            id="id_main_customer"
                            placeholder="Select Customer"
                            options={customerSelectList}
                            onChange={(value) => setFieldValue("id_main_customer", value)}
                            onBlur={handleBlur}
                            value={values.id_main_customer}
                            valid={!errors.id_main_customer && !!values.id_main_customer}
                            invalid={touched.id_main_customer && !!errors.id_main_customer}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_main_customer? errors.id_main_customer.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Parent</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isLoading={boundarySelectListStatus !== "success"}
                            isClearable={false}
                            name="idParents"
                            id="idParents"
                            placeholder="Select Parent"
                            options={boundarySelectList}
                            onChange={(value) => setFieldValue("idParents", value)}
                            onBlur={handleBlur}
                            value={values.idParents}
                            valid={!errors.idParents && !!values.idParents}
                            invalid={touched.idParents && !!errors.idParents}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.idParents? errors.idParents.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Description</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="location_desc"
                        name="location_desc"
                        placeholder="Description"
                        valid={!errors.location_desc && !!values.location_desc}
                        invalid={touched.location_desc && !!errors.location_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.location_desc || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.location_desc}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Type</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <Select
                            isSearchable
                            isClearable={false}
                            isLoading={boundaryTypeListStatus !== "success"}
                            name="id_location_type"
                            id="id_location_type"
                            placeholder="Select Boundary Type"
                            options={boundaryTypeList}
                            onChange={(value) => setFieldValue("id_location_type", value)}
                            onBlur={handleBlur}
                            value={values.id_location_type}
                            valid={!errors.id_location_type && !!values.id_location_type}
                            invalid={touched.id_location_type && !!errors.id_location_type}
                            disabled={isSubmitting}
                        />
                        <CFormText color="danger">{
                            errors.id_location_type? errors.id_location_type.label : null
                        }</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Height</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="number"
                        id="location_height"
                        name="location_height"
                        placeholder="Boundary height"
                        valid={!errors.location_height && !!values.location_height}
                        invalid={touched.location_height && !!errors.location_height}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.location_height || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.location_height}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Boundary Square Meter</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="number"
                        id="location_square_meter"
                        name="location_square_meter"
                        placeholder="Boundary square meter"
                        valid={!errors.location_square_meter && !!values.location_square_meter}
                        invalid={touched.location_square_meter && !!errors.location_square_meter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.location_square_meter || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.location_square_meter}</CFormText>
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
            Add New Boundary
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

export default BoundaryAddModal;