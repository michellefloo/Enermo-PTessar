import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CCol,
} from "@coreui/react";
import BigSpinner from "../../../../components/ui/big-spinner/BigSpinner";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useUpdateBudget } from "../../../../api/setting";
import { toast } from "react-toastify";
import { MONTHS_ARRAY } from "../../../../utils/constant";
import moment from "moment";

const BudgetUpdateModal = () => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const { modalName, initialValues } = useSelector((state) => state.modalState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [toggleStatus, setToggleModal] = useState(false);
  const mutationUpdateBudget = useUpdateBudget((oldData, newData) => [
    ...oldData,
    newData,
  ]);
  const currentYear = moment().format("YYYY");

  useEffect(() => {
    setToggleModal(modalName === "budgetModal");
  }, [modalName]);

  const UserModalForm = forwardRef((_, ref) => {
    const formik = useFormik({
      initialValues: initialValues,
      onSubmit: async (values) => {
        setSubmitting(true);
        try {
          const mutateAsyncArr = [];
          Object.keys(values).forEach((key) => {
            mutateAsyncArr.push(
              mutationUpdateBudget.mutateAsync({
                id_field_budget: key,
                budget_limit: values[key].toString(),
              })
            );
          });
          Promise.all(mutateAsyncArr).then((res) => {
            if (res[0].status === 200) {
              toast.success("Budget Updated Successfully");
              setSubmitting(false);
              dispatch({ type: "CLOSE_MODAL" });
            }
          });
        } catch (e) {
          setSubmitting(false);
          toast.error(e.response.data.message);
        }
      },
    });
    const { values, errors, touched, handleBlur, handleChange, isSubmitting } =
      formik;
    useImperativeHandle(ref, () => ({
      ...formik,
    }));
    return (
      <CForm>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">Daily Budget</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="number"
              id="10004"
              name="10004"
              placeholder="Daily Budget Limit"
              valid={!errors["10004"] && !!values["10004"]}
              invalid={touched["10004"] && !!errors["10004"]}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values["10004"] || 0}
              disabled={isSubmitting}
            />
          </CCol>
        </CFormGroup>
        {MONTHS_ARRAY.map((month, index) => (
          <CFormGroup row key={index}>
            <CCol md="4" xs="4">
              <CLabel htmlFor="text-input">
                Budget Limit for {month} {currentYear}
              </CLabel>
            </CCol>
            <CCol xs="8" md="8">
              <CInput
                type="number"
                id={index + 1 + currentYear}
                name={index + 1 + currentYear}
                placeholder="Monthly Budget Limit"
                valid={
                  !errors[index + 1 + currentYear] &&
                  !!values[index + 1 + currentYear]
                }
                invalid={
                  touched[index + 1 + currentYear] &&
                  !!errors[index + 1 + currentYear]
                }
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[index + 1 + currentYear] || 0}
                disabled={isSubmitting}
              />
            </CCol>
          </CFormGroup>
        ))}
      </CForm>
    );
  });

  return (
    <CModal
      show={toggleStatus}
      closeOnBackdrop={false}
      onClose={() => dispatch({ type: "CLOSE_MODAL" })}
      size="lg"
    >
      <CModalHeader closeButton className="font-weight-bold">
        Budget
      </CModalHeader>
      <CModalBody>
        {!isSubmitting ? (
          <UserModalForm ref={formRef} />
        ) : (
          <BigSpinner text="Updating, please wait..." />
        )}
      </CModalBody>
      <CModalFooter>
        <CButton
          disabled={isSubmitting}
          color="warning"
          onClick={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          Cancel
        </CButton>
        <CButton
          disabled={isSubmitting}
          color="info"
          className="w-25"
          onClick={() => formRef.current.submitForm()}
        >
          <strong>Submit</strong>
        </CButton>{" "}
      </CModalFooter>
    </CModal>
  );
};

export default BudgetUpdateModal;
