import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import { CModal, CModalBody, 
        CModalFooter, CModalHeader,
        CButton, CForm, 
        CFormGroup, CLabel, 
        CInput, CCol
} from '@coreui/react';
import { useFormik} from 'formik'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useUpdateParameter } from '../../../../api/setting'
import { toast } from 'react-toastify';
import BigSpinner from 'src/components/ui/big-spinner/BigSpinner'

const ParameterUpdateModal = () => {

    const formRef = useRef()
    const dispatch = useDispatch()
    const {modalName, initialValues} = useSelector(state => state.modalState)
    const [isSubmitting, setSubmitting] = useState(false)
    const [toggleStatus, setToggleModal] = useState(false)
    const [parameter, setparameter] = useState(null)
    const mutationUpdateParameter = useUpdateParameter((oldData, newData) => [...oldData, newData])

    useEffect(() => {  
        setToggleModal(modalName === "parameterModal")
    }, [modalName])

    const ParamterModalForm = forwardRef((_, ref) => {
        const formik = useFormik({
            initialValues: parameter? parameter : initialValues,
            onSubmit: async (values) => {
                setSubmitting(true)
                const copyOfValues = {...values}
                try {
                    const promise1  = await mutationUpdateParameter.mutateAsync({
                        id_field_budget: 10001,
                        budget_limit: values.normal_tarrif.toString()
                    })
                    const promise2  = await mutationUpdateParameter.mutateAsync({
                        id_field_budget: 10002,
                        budget_limit: values.peak_tarrif.toString()
                    })
                    const promise3  = await mutationUpdateParameter.mutateAsync({
                        id_field_budget: 10003,
                        budget_limit: values.carb_per_kwh.toString()
                    })
                    Promise.all([promise1,promise2,promise3])
                    .then((res) => {
                        if(res[0].status === 200){
                            toast.success("Paramter Updated Successfully");
                            setSubmitting(false)          
                            setparameter(null)             
                            dispatch({type:"CLOSE_MODAL"})
                        }
                    })
                  } catch (e) {
                    setSubmitting(false)
                    setparameter(copyOfValues)
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
                        <CLabel htmlFor="text-input">Normal Tarrif (Rp)</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="number"
                        id="normal_tarrif"
                        name="normal_tarrif"
                        placeholder="Normal Tarrif"
                        valid={!errors.normal_tarrif && !!values.normal_tarrif}
                        invalid={touched.normal_tarrif && !!errors.normal_tarrif}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.normal_tarrif || ''}
                        disabled={isSubmitting}
                    />
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Peak Tarrif (Rp)</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="number"
                        id="peak_tarrif"
                        name="peak_tarrif"
                        placeholder="Peak Tarrif"
                        valid={!errors.peak_tarrif && !!values.peak_tarrif}
                        invalid={touched.peak_tarrif && !!errors.peak_tarrif}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.peak_tarrif || ''}
                        disabled={isSubmitting}
                    />
                    </CCol>
                </CFormGroup> 
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Carbon Emission per Kwh</CLabel>
                    </CCol>
                    <CCol xs="8" md="8">
                    <CInput 
                        type="number"
                        id="carb_per_kwh"
                        name="carb_per_kwh"
                        placeholder="Carbon Emission per Kwh"
                        valid={!errors.carb_per_kwh && !!values.carb_per_kwh}
                        invalid={touched.carb_per_kwh && !!errors.carb_per_kwh}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.carb_per_kwh || ''}
                        disabled={isSubmitting}
                    />
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
           Parameter
        </CModalHeader>
        <CModalBody>
            {!isSubmitting?
                <ParamterModalForm ref={formRef}/>
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

export default ParameterUpdateModal;