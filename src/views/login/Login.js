import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/auth-slice'
import { Redirect } from 'react-router-dom'
import { userLogin } from '../../api/auth'
import { Formik } from 'formik'
import * as Yup from 'yup';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import cn from 'classnames'
import CIcon from '@coreui/icons-react'
import LoginBackground from '../../components/ui/login-background/LoginBackground'
import enermoLogo from '../../assets/brand/enermo-logo.png'
import styles from '../../css/login.module.css'
import { toast } from 'react-toastify';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),

  password: Yup.string()
                .min(6, "Password should be connsisting of min. 8 characters")
                .required("Password is required"),
});

const mailto = `mailto:rizky@automa.id?cc=sales@automa.id
                &subject=Subscribe%20Automa%20Platform
                &body=Saya%20ingin%20tahu%20lebih%20jauh%20mengenai%20Automa%20IoT%20Platform`

const Login = () => {
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.error)
  const { token } = useSelector((state) => state.auth.data) || {}
  useEffect(() => {
    if(loginError)
      toast.error(loginError)
    return () => {
      dispatch(authActions.cleanUp())
    }
  }, [loginError, dispatch]);
  return (
    <Fragment>
      {token && <Redirect to="/" />}
      {!token &&
        <div className="c-app c-default-layout flex-row align-items-center">
          <LoginBackground />
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md="8">
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardBody>
                    <Formik
                      initialValues={{ email: '', password: '' }}
                      validationSchema={LoginSchema}
                      onSubmit={(credential, {setSubmitting}) => {
                        dispatch(userLogin(credential));
                        setTimeout(()=>setSubmitting(false),500)
                      }}
                      >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                      }) => (
                        <CForm onSubmit={handleSubmit}>
                          <div className={styles["enermo-logo-container"]}>
                              <img className={styles["enermo-logo-container__img"]} src={enermoLogo} alt="Login background" />
                          </div>
                          <p className="text-muted">Sign In to Enermo 2.2</p>
                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                                <CIcon name="cil-user" />
                              </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput 
                              type="email"
                              id="email"
                              name="email"
                              placeholder="Enter your email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              disabled={isSubmitting}
                            />
                            {errors.email && touched.email && 
                              <div className={cn(styles["input-feedback"], styles["input-feedback--invalid"])}>
                                {errors.email}
                              </div>
                            }
                          </CInputGroup>
                          <CInputGroup className="mb-4">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                                <CIcon name="cil-lock-locked" />
                              </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput 
                              type="password"
                              id="password"
                              name="password"
                              placeholder="Password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                              disabled={isSubmitting}
                            />
                            {errors.password && touched.password && 
                              <div className={cn(styles["input-feedback"], styles["input-feedback--invalid"])}>
                                {errors.password}
                              </div>
                            }
                          </CInputGroup>
                          <CRow>
                            <CCol xs="6" >
                              <a className="px-0 text-info" href={mailto}>Interested? Contact us!</a>
                            </CCol>
                            <CCol xs="6" className="text-right">
                              <CButton 
                                type="submit" 
                                color="info" 
                                className="px-5"
                                disabled={isSubmitting}
                                >
                                 <strong>Login</strong> 
                              </CButton>
                            </CCol>
                          </CRow>
                        </CForm>
                      )}
                      </Formik>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      }
    </Fragment>
  )
}

export default Login
