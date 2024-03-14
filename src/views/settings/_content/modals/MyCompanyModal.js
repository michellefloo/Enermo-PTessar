import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, 
        CInput, CFormText, CCol,
        CTextarea
} from '@coreui/react';
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateUserCompany } from 'src/api/user-management'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import BigSpinner from 'src/components/ui/big-spinner/BigSpinner'

const CustomerAddSchema = Yup.object().shape({

    address: Yup.string().required('Main address is required'),
    lat: Yup.number().required('Latitude is required'),
    lon: Yup.number().required('Longitude is required'),
    telp: Yup.string()
                .min(7, 'Mobile phone number (Whatsapp) should not be shorter than 7 characters!')
                .matches(/^[6]{1}[2]{1}[0-9]{6}/, 'Phone number should be start with 62')
                .required('Whatsapp number is required')

});

const MyCompanyAddModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const loginData = useSelector((state) => state.auth.data)   
    const { company } = loginData
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const [myCompany, setmyCompany] = useState(null)
    const mutationUpdateCompany = useUpdateUserCompany((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "myCompanyModal")
    }, [modalName])

    const CompanyModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: myCompany? myCompany : initialValues,
            validationSchema: CustomerAddSchema,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                try {
                    await mutationUpdateCompany.mutateAsync(values)
                    .then((res) => {
                        if(res.status === 200){
                            toast.success("Company Edited Successfully");
                            setSubmitting(false)          
                            setmyCompany(null)             
                            dispatch({type:"CLOSE_MODAL"})
                        }
                    })
                  } catch (e) {
                    setSubmitting(false)
                    setmyCompany(copyOfValues)
                    toast.error(e.response.data.message);
                }
            },
          });
        const {
            values,errors,
            touched,
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
                        <CLabel htmlFor="text-input">Company Name</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        {company}
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Address</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                        <CTextarea 
                            id="address"
                            name="address"
                            placeholder="Main Address"
                            valid={!errors.address && !!values.address}
                            invalid={touched.address && !!errors.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.address || ''}
                            disabled={isSubmitting}
                            row={4}
                        />
                        <CFormText color="danger">{errors.address}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Latitude</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="number"
                        id="lat"
                        name="lat"
                        placeholder="Latitude"
                        valid={!errors.lat && !!values.lat}
                        invalid={touched.lat && !!errors.lat}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lat || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.lat}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Longitude</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                            <CInput 
                                type="number"
                                id="lon"
                                name="lon"
                                placeholder="Longitude"
                                valid={!errors.lon && !!values.lon}
                                invalid={touched.lon && !!errors.lon}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lon || ''}
                                disabled={isSubmitting}
                            />
                        <CFormText color="danger">{errors.lon}</CFormText>
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Phone (Whatsapp)</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="text"
                        id="telp"
                        name="telp"
                        placeholder="Phone (Whatsapp)"
                        valid={!errors.telp && !!values.telp}
                        invalid={touched.telp && !!errors.telp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.telp || ''}
                        disabled={isSubmitting}
                    />
                    <CFormText color="danger">{errors.telp}</CFormText>
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
            My Company
        </CModalHeader>
        <CModalBody>
            {!isSubmitting?
                <CompanyModalForm ref={formRef}/>
                :
                <BigSpinner text="Updating, Please Wait..."/>
            }
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

export default MyCompanyAddModal;