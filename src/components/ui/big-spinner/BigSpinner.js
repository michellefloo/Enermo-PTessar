import React, {Fragment} from "react";
import { CSpinner  } from '@coreui/react'
const BigSpinner = ({text}) => {
    return(
        <Fragment>
            <CSpinner className="spinner spinner--spacer-bottom mt-5 mb-5"
                style={{width:'4rem', height:'4rem', 
                        margin:'auto', display:'block',
                    }}
                color="info" variant="grow" 
            />
            {text && <div className="text-center">{text}</div> }
        </Fragment>
    )
}

export default BigSpinner