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
  CFormText,
  CCol,
  CTextarea,
} from "@coreui/react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAddCustomer } from "src/api/customer";
import { toast } from "react-toastify";
import * as Yup from "yup";

const CustomerAddSchema = Yup.object().shape({
  name: Yup.string().required("Customer name is required"),
  lat: Yup.number().required("Latitude is required"),
  lng: Yup.number().required("Longitude is required"),
  main_address: Yup.string().required("Main address is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  fax: Yup.string()
    .min(7, "Phone number should not be shorter than 7 characters!")
    .matches(/^[6]{1}[2]{1}[0-9]{6}/, "Phone number should be start with 62"),
  phone: Yup.string()
    .min(7, "Phone number should not be shorter than 7 characters!")
    .matches(/^[6]{1}[2]{1}[0-9]{6}/, "Phone number should be start with 62"),
  handphone: Yup.string()
    .min(
      7,
      "Mobile phone number (Whatsapp) should not be shorter than 7 characters!"
    )
    .matches(/^[6]{1}[2]{1}[0-9]{6}/, "Phone number should be start with 62")
    .required("Whatsapp number is required"),
});

const CustomerAddModal = () => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const { modalName, initialValues } = useSelector((state) => state.modalState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [toggleStatus, setToggleModal] = useState(false);
  const [CustomerData, setCustomerData] = useState(null);
  const mutationAddUser = useAddCustomer((oldData, newData) => [
    ...oldData,
    newData,
  ]);

  useEffect(() => {
    setToggleModal(modalName === "addCustomerModal");
  }, [modalName]);

  const UserModalForm = forwardRef((_, ref) => {
    const formik = useFormik({
      initialValues: CustomerData ? CustomerData : initialValues,
      validationSchema: CustomerAddSchema,
      onSubmit: async (values) => {
        setSubmitting(true);
        const copyOfValues = { ...values };
        try {
          await mutationAddUser.mutateAsync(values).then((res) => {
            if (res.status === 200) {
              toast.success("Customer Added Successfully");
              setSubmitting(false);
              setCustomerData(null);
              dispatch({ type: "CLOSE_MODAL" });
            }
          });
        } catch (e) {
          setSubmitting(false);
          setCustomerData(copyOfValues);
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
            <CLabel htmlFor="text-input">Customer Name</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="text"
              id="name"
              name="name"
              placeholder="Customer Name"
              valid={!errors.name && !!values.name}
              invalid={touched.name && !!errors.name}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.name}</CFormText>
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
              placeholder="lat"
              valid={!errors.lat && !!values.lat}
              invalid={touched.lat && !!errors.lat}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lat || ""}
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
              id="lng"
              name="lng"
              placeholder="Longitude"
              valid={!errors.lng && !!values.lng}
              invalid={touched.lng && !!errors.lng}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lng || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.lng}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">Main Address</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CTextarea
              id="main_address"
              name="main_address"
              placeholder="Main Address"
              valid={!errors.main_address && !!values.main_address}
              invalid={touched.main_address && !!errors.main_address}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.main_address || ""}
              disabled={isSubmitting}
              row={3}
            />
            <CFormText color="danger">{errors.main_address}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">Email</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              valid={!errors.email && !!values.email}
              invalid={touched.email && !!errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.email}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">Phone</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="text"
              id="phone"
              name="phone"
              placeholder="Phone"
              valid={!errors.phone && !!values.phone}
              invalid={touched.phone && !!errors.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.phone}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">Fax Number</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="text"
              id="fax"
              name="fax"
              placeholder="Fax"
              valid={!errors.fax && !!values.fax}
              invalid={touched.fax && !!errors.fax}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.fax || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.fax}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">Whatsapp Number</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="text"
              id="handphone"
              name="handphone"
              placeholder="Whatsapp Number"
              valid={!errors.handphone && !!values.handphone}
              invalid={touched.handphone && !!errors.handphone}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.handphone || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.handphone}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">PIC Finance Name</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="text"
              id="pic_finance"
              name="pic_finance"
              placeholder="PIC Finance Name"
              valid={!errors.pic_finance && !!values.pic_finance}
              invalid={touched.pic_finance && !!errors.pic_finance}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.pic_finance || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.pic_finance}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">PIC Finance Email</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CInput
              type="text"
              id="pic_finance_email"
              name="pic_finance_email"
              placeholder="PIC Finance Email"
              valid={!errors.pic_finance_email && !!values.pic_finance_email}
              invalid={touched.pic_finance_email && !!errors.pic_finance_email}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.pic_finance_email || ""}
              disabled={isSubmitting}
            />
            <CFormText color="danger">{errors.pic_finance_email}</CFormText>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4" xs="4">
            <CLabel htmlFor="text-input">Description</CLabel>
          </CCol>
          <CCol xs="8" md="8">
            <CTextarea
              id="desc"
              name="desc"
              placeholder="Description"
              valid={!errors.desc && !!values.desc}
              invalid={touched.description && !!errors.desc}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.desc || ""}
              disabled={isSubmitting}
              row={2}
            />
            <CFormText color="danger">{errors.desc}</CFormText>
          </CCol>
        </CFormGroup>
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
        Add New Customer
      </CModalHeader>
      <CModalBody>
        <UserModalForm ref={formRef} />
      </CModalBody>
      <CModalFooter>
        <CButton
          disabled={isSubmitting}
          color="info"
          onClick={() => formRef.current.submitForm()}
        >
          <strong>Submit</strong>
        </CButton>{" "}
        <CButton
          disabled={isSubmitting}
          color="warning"
          onClick={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default CustomerAddModal;
