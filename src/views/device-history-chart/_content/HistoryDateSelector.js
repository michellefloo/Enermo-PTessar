import React, { useContext } from "react";
import Datetime from 'react-datetime'
import { DATE_ISO8601_NO_TIME } from "src/utils/constant";
import {
    CCard, CCardBody, CCardHeader,
    CForm, CFormGroup, CLabel,
    CFormText, CCol, CButton
} from '@coreui/react';
import { useFormik} from 'formik'
import { DeviceHistoryContext2 } from '../_provider/DeviceHistoryChartProvider'
import * as Yup from 'yup';
import moment from 'moment'
import { toast } from 'react-toastify';
const HistoryDateSelectorSchema = Yup.object().shape({
    start_date: Yup.string()
        .required("Start on date is required")
        .test(
            "date validation",
            "Invalid date or format. should be a valid YYYY-MM-DD format.",
            val => {
            if (!val) {
                return true;
            }
            return moment(val, "YYYY-MM-DD", true).isValid();
        }), 


    // end_date: Yup.string()
    //     .required("End date is required")
    //     .test(
    //         "date validation",
    //         "Invalid date or format. should be a valid YYYY-MM-DD format.",
    //         val => {
    //         if (!val) {
    //             return true;
    //         }
    //         return moment(val, "YYYY-MM-DD", true).isValid();
    //     }),
})

const HistoryDateSelector = () => {
    const {selectedStartDate, selectedEndDate, 
        setSelectedStartDate, setSelectedEndDate,
        selectedDevice
    } = useContext(DeviceHistoryContext2) 
    const formik = useFormik({
        initialValues: {
            start_date: selectedStartDate,
            end_date: selectedEndDate
        },
        onSubmit: (values, {setSubmitting}) => {
                setSubmitting(true)
                // if(moment(values.start_date) >= moment(values.end_date)){
                //     toast.error("Start date should be less than end date")
                //     setSubmitting(false)
                //     return
                // }
                // if(moment(values.end_date).diff(moment(values.start_date), 'days') >= 5){
                //     toast.error("Date range should not exceed 1 week")
                //     setSubmitting(false)
                //     return
                // }
                try {
                    setSelectedStartDate(values.start_date)
                    setSelectedEndDate(values.end_date)
                    setSubmitting(false)
                  } catch (e) {
                    setSubmitting(false)
                    toast.error(e.message);
                }
            },
        validationSchema: HistoryDateSelectorSchema
    })
    const {
        values,errors,
        touched,setFieldValue,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
    } = formik
    return(
        <CCard>
            <CCardHeader>
                History Date Selector
            </CCardHeader>
            <CCardBody>
            <CForm>
                <CFormGroup row>
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">Date</CLabel>
                    </CCol>
{/* 
                    <CCol md="4" xs="4">
                        <CLabel htmlFor="text-input">End Date</CLabel>
                    </CCol> */}
                </CFormGroup>

                <CFormGroup row>
                    <CCol md="4" xs="4">
                    <Datetime 
                            id="start_date"
                            name="start_date"
                            placeholder="Start Date"
                            timeFormat={false}
                            dateFormat={DATE_ISO8601_NO_TIME}
                            inputProps={{
                                placeholder: "Select Start of History Date",
                                disabled: selectedDevice.id === -1 || isSubmitting ||selectedStartDate
                            }}
                            valid={!errors.start_date && !!values.start_date}
                            invalid={touched.start_date && !!errors.start_date}
                            onChange={(value) => {
                                const date = moment(value, "YYYY-MM-DD", true).isValid() ? value.format(DATE_ISO8601_NO_TIME) : value
                                setFieldValue("start_date", date)
                            }}
                            value={values.start_date || ''}
                        />
                        <CFormText color="danger">{errors.start_date}</CFormText>
                    </CCol>
                    {/* <CCol md="4" xs="4">
                        <Datetime 
                            id="end_date"
                            name="end_date"
                            placeholder="End Date"
                            timeFormat={false}
                            dateFormat={DATE_ISO8601_NO_TIME}
                            inputProps={{
                                placeholder: "Select End of History Date",
                                disabled: selectedDevice.id === -1 || isSubmitting ||(selectedStartDate && selectedEndDate)
                            }}
                            valid={!errors.end_date && !!values.end_date}
                            invalid={touched.end_date && !!errors.end_date}
                            onChange={(value) => {
                                const date = moment(value, "YYYY-MM-DD", true).isValid() ? value.format(DATE_ISO8601_NO_TIME) : value
                                setFieldValue("end_date", date)
                            }}
                            value={values.end_date || ''}
                        />
                        <CFormText color="danger">{errors.end_date}</CFormText>
                    </CCol> */}
                    <CCol md="4" xs="4">
                        <CButton 
                            type="submit" 
                            color="info"
                            disabled={isSubmitting || selectedDevice.id === -1 || selectedStartDate !== null} 
                            onClick={handleSubmit}
                        >
                            Fetch Device History
                        </CButton>
                    </CCol>
                </CFormGroup>
            </CForm>
            </CCardBody>
        </CCard>
    )
}

export default HistoryDateSelector