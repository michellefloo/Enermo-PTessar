import React, {Fragment} from 'react'
import { useSelector } from 'react-redux';
import cn from 'classnames'
import styles from '../../../css/header-additionals.module.css'

const UserName = () => {
    const loginData = useSelector((state) => state.auth.data)
    const { name } = loginData
    return(
        <Fragment>
            <p className={cn(styles["p--adjustment"])}>
                {name}
            </p>
        </Fragment>
    )
}

export default UserName