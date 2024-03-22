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
  CTextarea,
  CInput,
  CFormText,
  CCol,
} from "@coreui/react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAddDeviceGroup } from "src/api/device-group";
// import { useAddDeviceGroupDetail } from 'src/api/device-group-detail'
import { toast } from "react-toastify";
import * as Yup from "yup";
// import DeviceDatable from "./DeviceDatatable"

const DeviceGroupAddSchema = Yup.object().shape({
  group_name: Yup.string().required("Group name is required"),
  group_description: Yup.string().required("Description is required"),
});

const DeviceGroupAddModal = () => {
  const formRef = useRef();
  // const deviceTableRef = useRef()
  const dispatch = useDispatch();
  const { modalName, initialValues } = useSelector((state) => state.modalState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [toggleStatus, setToggleModal] = useState(false);
  const [deviceInstallationData, setDeviceInstallationData] = useState(null);
  const mutationAddDeviceGroup = useAddDeviceGroup(
    (oldData, newData) => [...oldData, newData],
    initialValues.id_group
  );
  // const mutationAddDeviceGroupDetail = useAddDeviceGroupDetail((oldData, newData) => [...oldData, newData])

  useEffect(() => {
    setToggleModal(modalName === "addGroupModal");
  }, [modalName]);

  const UserModalForm = forwardRef((_, ref) => {
    const formik = useFormik({
      initialValues: deviceInstallationData ? deviceInstallationData : {},
      validationSchema: DeviceGroupAddSchema,
      onSubmit: async (values) => {
        setSubmitting(true);
        const copyOfValues = { ...values };
        try {
          await mutationAddDeviceGroup.mutateAsync(values).then((res) => {
            // if(deviceTableRef.current){
            //  const {deviceData} = deviceTableRef.current
            //  deviceData.forEach(async d => {
            //     await mutationAddDeviceGroupDetail.mutateAsync({
            //         id_devices: d.id,
            //         id_group_devices:
            //     })
            //  })
            // }
            console.log(res);
            if (res.status === 200) {
              toast.success("Device Group Added Successfully");
              setSubmitting(false);
              setDeviceInstallationData(null);
              dispatch({ type: "CLOSE_MODAL" });
            }
          });
        } catch (e) {
          setSubmitting(false);
          setDeviceInstallationData(copyOfValues);
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
              value={values.group_name || ""}
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
              value={values.group_description || ""}
              disabled={isSubmitting}
              row={2}
            />
            <CFormText color="danger">{errors.group_description}</CFormText>
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
        Add New Device Group
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
          Submit
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

export default DeviceGroupAddModal;
