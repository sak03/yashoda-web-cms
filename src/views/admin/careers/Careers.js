import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import './careers.css'
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Divider } from 'primereact/divider';
import { useFormik } from "formik";
import { InputTextarea } from 'primereact/inputtextarea';
import {  FaMapMarkerAlt, FaIdCard, FaBook, FaBriefcase, FaDollarSign } from "react-icons/fa";
import { setEditMOde } from '../../../redux/actions/editModeAction';
import { useDispatch } from 'react-redux';

const Careers = () => {
  const [viewMode, setViewMode] = useState(0);
  const status = [
    { name: "ACTIVE", code: "ACT" },
    { name: "INACTIVE", code: "IN-ACT" },
  ];

  useEffect(()=>{
    dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
  },[])

  const jobFormik = useFormik({
    initialValues: {
      title: "",
      location: "",
      experience: "",
      jobType: "",
      workPlace: "",
      salary: "",
      jobDescription: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.title) {
        errors.title = "Please enter job title.";
      }
      if (!data.location) {
        errors.location = "Please enter job location.";
      }
      if (!data.experience) {
        errors.experience = "Please enter experience.";
      }
      if (!data.workPlace) {
        errors.workPlace = "Please select work place.";
      }
      if (!data.jobType) {
        errors.jobType = "Please select job type.";
      }
      if (!data.salary) {
        errors.salary = "Please enter salary.";
      }
      if (!data.jobDescription) {
        errors.jobDescription = "Please enter job description.";
      }

      return errors;
    },
    onSubmit: (data) => {
      console.log("form submitted !");
    },
  });
  const isJobFormFieldValid = (name) =>
    !!(jobFormik.touched[name] && jobFormik.errors[name]);
  const getJobFormErrorMessage = (name) => {
    return (
      isJobFormFieldValid(name) && (
        <small className="p-error">{jobFormik.errors[name]}</small>
      )
    );
  };

  const jobForm = () => {
    return (
      <form onSubmit={jobFormik.handleSubmit}>
        <div className='mx-3'>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="title"
                  value={jobFormik.values.title}
                  onChange={jobFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isJobFormFieldValid("title"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="title">Job Title</label>
              </span>
              {getJobFormErrorMessage("title")}
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="location"
                  value={jobFormik.values.location}
                  onChange={jobFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isJobFormFieldValid("location"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="location">Job location</label>
              </span>
              {getJobFormErrorMessage("location")}
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="experience"
                  value={jobFormik.values.experience}
                  onChange={jobFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isJobFormFieldValid("experience"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                  suffix=" Years"
                />
                <label htmlFor="experience">Experience (in years)</label>
              </span>
              {getJobFormErrorMessage("experience")}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="jobType"
                  inputId="dropdown"
                  value={jobFormik.values.jobType}
                  // options={jobType}
                  onChange={jobFormik.handleChange}
                  optionLabel="name"
                  className={
                    (classNames({
                      "p-invalid": isJobFormFieldValid("jobType"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="jobType">Job Type</label>
              </span>
              {getJobFormErrorMessage("jobType")}
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="workPlace"
                  inputId="dropdown"
                  value={jobFormik.values.workPlace}
                  // options={jobType}
                  onChange={jobFormik.handleChange}
                  optionLabel="name"
                  className={
                    (classNames({
                      "p-invalid": isJobFormFieldValid("workPlace"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="workPlace">Work Place</label>
              </span>
              {getJobFormErrorMessage("workPlace")}
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="salary"
                  value={jobFormik.values.salary}
                  onChange={jobFormik.handleChange}
                  optionLabel="name"
                  className={
                    (classNames({
                      "p-invalid": isJobFormFieldValid("salary"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="salary">Salary</label>
              </span>
              {getJobFormErrorMessage("salary")}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 mt-4">
              <span className="p-float-label">
                <InputTextarea
                  id="jobDescription"
                  value={jobFormik.values.jobDescription}
                  onChange={jobFormik.handleChange}
                  optionLabel="name"
                  className={
                    (classNames({
                      "p-invalid": isJobFormFieldValid("jobDescription"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="jobDescription">Job Description</label>
              </span>
              {getJobFormErrorMessage("jobDescription")}
            </div>
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-end my-3 mx-3">
          <Button
            label="Add"
            type="submit"
            className="bg-primary border-0  p-button-md  btn-color p-button-raised"
          />
          <Button
            onClick={() => {
              setViewMode(0);
              jobFormik.resetForm();
            }}
            label={"Cancel"}
            style={{ marginLeft: "10px" }}
            className="bg-danger border-0 p-button-md p-button-raised"
          />
        </div>
      </form>
    )
  }

  const renderHeader1 = () => {
    return (
      <div className="row d-flex">
        <div className="col-lg-8">
          <form
          // onSubmit={searchFormik.handleSubmit}
          >
            <div className="row gap-lg-0 mt-lg-0">
              <div className="col-sm-12 col-lg-4 mb-1">
                <span className="p-input-icon-left w-100">
                  <i className="pi pi-search" />
                  <InputText
                    // value={globalFilterValue1}
                    // onChange={onGlobalFilterChange1}
                    placeholder="Search name"
                    className="p-inputtext-sm w-100"
                    optionLabel="name"
                    optionValue="name"
                    filter={false}
                  />
                </span>
              </div>
              <div className="col-sm-12 col-lg-4 mb-1">
                <Dropdown
                  id="status"
                  name="status"
                  options={status}
                  // value={searchFormik.values.status}
                  // onChange={searchFormik.handleChange}
                  className="p-inputtext-sm w-100"
                  optionLabel="name"
                  optionValue="name"
                  filter={false}
                  placeholder="Status"
                />
              </div>
            </div>
          </form>
        </div>
        <div
          className="col-sm-12 col-md-12 col-lg-4 d-flex "
          style={{ justifyContent: "right" }}
        >
          <Button
            label="Post a Job"
            className="p-button-outlined p-button-primary p-button-md"
            onClick={() => {
              setViewMode(1);
            }}
          />
          <Button
            style={{
              marginLeft: "10px",
            }}
            role="button"
            icon="pi pi-filter-slash"
            label="Clear"
            className="p-button-outlined p-button-md"
          // onClick={() => {
          //   searchFormik.resetForm();
          //   initFilters1();
          //   if (pageNumber !== 1) {
          //     setPageNumber(1);
          //   } else {
          //     getAllAccounts({
          //       dateRange: null,
          //       status: "",
          //       page: 1,
          //     });
          //   }
          // }}
          />
        </div>
      </div>
    );
  };
  const header1 = renderHeader1();

  return (
    <div className='card p-2 pt-3'>
      {viewMode === 1 ? (jobForm()) : viewMode === 2 ? ("") : (
        <div>
          <div className='row'>{header1}</div>
          <Divider />
          <div className='row'>
            <div className='col-sm-12 col-md-6 col-lg-6 mt-2'>
              <div className='card p-3'>
                <strong className='mx-1 my-2'>Software Developer</strong>
                <p className='mt-2'>
                  <span ><FaBriefcase className='text-primary' /> 2-4 Years</span> &nbsp;
                  <span><FaDollarSign className='text-warning' />4-6 LPA</span> &nbsp; &nbsp;
                  <span><FaMapMarkerAlt className='text-danger' /> Hybrid</span>
                </p>
                <p>
                  <span><FaBook className='text-primary' /> </span>
                  <span>Looking for Smart Software Engineer, having rich exp…..</span>
                </p>
                <p>
                  <span><FaIdCard className='text-primary' /> </span>
                  <span>Java, JavaScript, HTML, MySQL, Python</span>
                </p>

              </div>
            </div>
            <div className='col-sm-12 col-md-6 col-lg-6 mt-2'>
              <div className='card p-3'>
                <strong className='mx-1 my-2'> Maths Teacher</strong>
                <p className='mt-2'>
                  <span ><FaBriefcase className='text-primary' /> 3-6 Years</span> &nbsp;
                  <span><FaDollarSign className='text-warning' />6-8 LPA</span> &nbsp; &nbsp;
                  <span><FaMapMarkerAlt className='text-danger' /> On Site</span>
                </p>
                <p>
                  <span><FaBook className='text-primary' /> </span>
                  <span>Looking for Smart and experience, having rich ...</span>
                </p>
                <p>
                  {/* <span><FaIdCard className='text-primary' /> </span> */}
                  {/* <span>Java, JavaScript, HTML, MySQL, Python</span> */}
                </p>

              </div>
            </div>
            <div className='col-sm-12 col-md-6 col-lg-6 mt-2'>
              <div className='card p-3'>
                <strong className='mx-1 my-2'>Accountent</strong>
                <p className='mt-2'>
                  <span ><FaBriefcase className='text-primary' /> 1-3 Years</span> &nbsp;
                  <span><FaDollarSign className='text-warning' />6-10  LPA</span> &nbsp; &nbsp;
                  <span><FaMapMarkerAlt className='text-danger' /> On Site</span>
                </p>
                <p>
                  <span><FaBook className='text-primary' /> </span>
                  <span>Looking for Accountent, having rich exp…..</span>
                </p>
                <p>
                  {/* <span><FaIdCard className='text-primary' /> </span> */}
                  {/* <span>Java, JavaScript, HTML, MySQL, Python</span> */}
                </p>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Careers