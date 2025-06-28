import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";
import logo from "../../../assets/images/yashoda_site_logo.png";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { loginMode } from '../../../redux/action'
import { userLoginInfo } from '../../../redux/loginInfoAction'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppConstants } from '../../../constants/constants';
import { Toast } from 'primereact/toast';
import axios from "axios";
// import {setLoginUserInfo} from '../../../redux/actions/loginAction'
import './login.css'
export let userMode;
export let userModeValue;
import { addAuthToken } from '../../../redux/actions/authTokenAction'



const Login = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  let data = useSelector((state) => state);
  // console.log("data", data)
  const navigate = useNavigate();

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.email) {
        errors.email = "Please enter username or email.";
      }
      if (!data.password) {
        errors.password = "Please enter password.";
      }

      return errors;
    },
    onSubmit: (data) => {
      // console.log("formik", data);
      // loginUser(data);
      navigate("/dashboard");
    },
  });
  const isLoginFormFieldValid = (name) =>
    !!(loginFormik.touched[name] && loginFormik.errors[name]);
  const getLoginFormErrorMessage = (name) => {
    return (
      isLoginFormFieldValid(name) && (
        <small className="p-error">{loginFormik.errors[name]}</small>
      )
    );
  };

  // =========== login api ========== ========
  const loginUser = async (data) => {
    const postData = {
      email: data.email,
      password: data.password
    }
    // console.log("postData", postData);
    await axios
      .post(
        `${AppConstants.Api_BaseUrl}users/admin/login`, postData,
        {
          headers: {
            // Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhlY2Y1OWMwZTVmNjJiM2ZkMWI4ZiIsImlhdCI6MTY2OTkxNzk0MX0.hWr6QfcSlsTWPOoEY4nLbFDmeGKLACewjacRMxuyQtE",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        let dt = res.data;

        if (dt.data  !== undefined ) {
          const tokenVal = JSON.stringify(dt.data)
          userMode = 1;
          navigate("/dashboard");
          dispatch(addAuthToken(dt));
          dispatch(loginMode({ userModeValue: 1 }))
          localStorage.setItem('token', tokenVal);
          const tokenData = localStorage.getItem('token')
          // console.log("loginData", tokenData)
        } else {
          showErrorMessage("error", dt.error.message);
          // navigate("/login");
        }
        // console.log("error", dt);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // === show error message ==== ===
  const showErrorMessage = (severity, errMsg) => {
    toast.current.show({
      severity: severity == 'success' ? 'success' : 'error',
      summary: severity === 'success' ? "Added" : "Oops",
      detail: severity === 'success' ? 'Successfully loggedin' : errMsg,
      life: 3000
    });
  }


  return (
    <>
      <Toast ref={toast} />
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <div
          className="login-logo shadow rounded"
          style={{ position: "absolute", top: "2rem", left: "2rem" }}
        >
          <img src={logo} alt="login" width={200} className='' />
          {/* </a> */}
        </div>
        <CContainer>
          <CRow className="justify-content-center border-0">
            <div className="card p-4 col-lg-4 border-0 shadow-lg">
              <div className="row">
                <form onSubmit={loginFormik.handleSubmit}>
                  <div className=" col-sm-12 col-md-4 col-lg-12 mt-4">
                    <span className="p-float-label">
                      <InputText
                        id="email"
                        value={loginFormik.values.email}
                        onChange={loginFormik.handleChange}
                        className={
                          (classNames({
                            "p-invalid": isLoginFormFieldValid("email"),
                          }),
                            "p-inputtext-sm w-100 borderClass")
                        }
                      />
                      <label htmlFor="email">Username</label>
                    </span>
                    {getLoginFormErrorMessage("email")}
                  </div>
                  <div className=" col-sm-12 col-md-12 col-lg-12 mt-4">
                    <span className="p-float-label">
                      <Password
                        id="password"
                        inputId="password"
                        value={loginFormik.values.password}
                        onChange={loginFormik.handleChange}
                        className={
                          (classNames({
                            "p-invalid": isLoginFormFieldValid("password"),
                          }),
                            "p-inputtext-sm w-100 borderClass")
                        }
                        toggleMask
                        feedback={false}
                      />
                      <label htmlFor="password">Password</label>
                    </span>
                    {getLoginFormErrorMessage("password")}
                  </div>
                  <div className="text-right mt-2 mb-4">
                    <span
                      className="mx-2 text-primary"
                      style={{ cursor: "pointer" }}
                    >
                      Forgot password?
                    </span>
                  </div>
                  <CRow>
                    <CCol xs={12}>
                      <CButton
                        type="submit"
                        color="primary"
                        className="px-4 w-100"
                      >
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                  <div className="text-right mt-3">
                    <p>
                      Don't have an account ?
                      <span className="mx-2">
                        <Link to='/register' style={{ textDecoration: "none" }}>Sign Up</Link>

                      </span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
          </CRow>
        </CContainer>
      </div>
    </>
  );
};

export default Login;
