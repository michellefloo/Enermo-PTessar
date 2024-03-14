import React from 'react'
import { useSelector } from 'react-redux'
import {
    CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Papa from 'papaparse'
import config from 'src/utils/papaparse'
import { downloadCsv } from 'src/utils/helpers'

const ExportToCsvBUtton = () => {
    const {fields, data, fileName} = useSelector(state => state.exportToCsvFromCoreUiDatatable)
    
    const getPapaData = async () => {
        return data.map((d) => {
            const row = []
            fields.forEach((f) => {
                row.push(d[f.key])
            })
            return row
        })
    }

    const getPapaFields = async () => {
        return fields.map((f) => {
            return f.label
        })
    }
    
    const exportToCsv = async () => {
        const csv = Papa.unparse({
            "fields": await getPapaFields(),
            "data": await getPapaData()
        }, config);
        downloadCsv(csv, fileName)
    }

    const isButtonNeedDisable = () => {
        return data.length === 0
    }

    return(
        <CButton color="success" 
                 style={{width:"100%"}}
                onClick={exportToCsv}
                disabled={isButtonNeedDisable()}>
            <CIcon name={'cilCloudDownload'} /> Export to CSV
        </CButton>
    )
}

export default ExportToCsvBUtton