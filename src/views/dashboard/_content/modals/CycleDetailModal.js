import React, { useEffect, useState } from "react";
import { CModal, CModalBody, CModalHeader, CDataTable } from "@coreui/react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import { ExportCsvFromCoreUiDatatable } from '../../../../components/export-to-csv-button'

const CycleDetail = () => {
  const dispatch = useDispatch();
  const { modalName, initialValues } = useSelector((state) => state.modalState);
  const [toggleStatus, setToggleModal] = useState(false);

  const fields = [
    { key: "cycle", label: "Cycle", _style: { width: "10%" } },
    { key: "start_time", label: "Start Time", _style: { width: "25%" } },
    { key: "end_time", label: "End Time", _style: { width: "25%" } },
    { key: "duration", label: "Duration (min.)", _style: { width: "15%" } },
  ];

  useEffect(() => {
    setToggleModal(modalName === "cycleDetailModal");
    // if(modalName === "cycleDetailModal"){
    //     dispatch({type: 'exportFromCoreUIDataTable',
    //         fields: [
    //             { key: 'cycle', label: 'Cycle'},
    //             { key: 'start_time', label: "Start Time"},
    //             { key: 'end_time', label: "End Time"},
    //             { key: 'duration', label: "Duration"},
    //         ],
    //         data: initialValues.detail? initialValues.detail : [],
    //         fileName: 'Today\'s Cycle Detail'
    //     })
    // }
  }, [modalName, dispatch]);

  return (
    <CModal
      show={toggleStatus}
      closeOnBackdrop={false}
      onClose={() => dispatch({ type: "CLOSE_MODAL" })}
      size="xl"
    >
      <CModalHeader closeButton className="font-weight-bold">
        Today's {initialValues.device_name} Cycle Detail
      </CModalHeader>
      <CModalBody>
        {/* <div className="d-flex justify-content-end flex-wrap">
                    <ExportCsvFromCoreUiDatatable />
            </div>
            <br /> */}
        <CDataTable
          items={initialValues.detail}
          striped
          responsive
          fields={fields}
          itemsPerPage={15}
          hover
          sorter
          pagination
          _classes={{ thead: { backgroundColor: "dark", textColor: "white" } }}
        />
      </CModalBody>
    </CModal>
  );
};

export default CycleDetail;
