import React, { Fragment, useState, useEffect} from 'react'
import {
    CDataTable,
  } from '@coreui/react'

const CycleDatatable = ({rowData, allData}) => {
    const [filteredData, setFilteredData] = useState([])

    useEffect(() => {
        const r = allData.filter((item) => item.id === rowData.id)
        if(r.length === 0) return
        setFilteredData(r[0].cycle)
    }
    , [rowData, allData])

    const fields = [
        { key: 'cycle', label: 'Cycle', _style: { width: '10%'}},
        { key: 'start_time', label: "Start Time", _style: { width: '25%'}},
        { key: 'end_time', label: "End Time", _style: { width: '25%'}},
        { key: 'duration', label: "Duration (min.)", _style: { width: '15%'}},

    ]   

    return (
        <Fragment>
            <CDataTable 
                items={filteredData}
                responsive
                fields={fields}
                itemsPerPage={15}
                hover
                sorter
                pagination
            />
        </Fragment>
    )
}

export default CycleDatatable