import React, { Fragment } from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { token } = useSelector((state) => state.auth.data) || {}
    return(
        <Fragment>
            {!token && <Redirect to="/login" />}
            { token && <Route {...rest} render={props=> <Component {...props} />}/>}
        </Fragment>
    )
}

export default PrivateRoute