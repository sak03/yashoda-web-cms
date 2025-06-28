import React, { useState, useEffect } from 'react'
import { AppConstants, formatDate } from '../../../constants/constants';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { CTooltip } from '@coreui/react';
import { InputTextarea } from 'primereact/inputtextarea';
import { setEditMOde } from '../../../redux/actions/editModeAction';
import { useDispatch } from 'react-redux';

const Cms = () => {
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState(null);
  const [viewMode, setViewMode] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    getCMSData();
    dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
  }, [])


  // ==== cms formik ==============
  const addCMSFormik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      section: "",
      editor: '',
    },
    validate: (data) => {
      let errors = {};

      if (!data.title) {
        errors.title = "Please enter title.";
      }
      if (!data.slug) {
        errors.slug = "Please enter slug.";
      }
      if (!data.section) {
        errors.section = "Please enter section.";
      }
      if (!data.editor) {
        errors.editor = "Please write description.";
      }

      return errors;
    },
    onSubmit: (data) => {
      console.log("formikData", data)
      // viewMode === 1 ? addNewUser(data) : updateUser(data);
    },
  });
  const isCMSFormFieldValid = (name) =>
    !!(addCMSFormik.touched[name] && addCMSFormik.errors[name]);
  const getCMSFormErrorMessage = (name) => {
    return (
      isCMSFormFieldValid(name) && (
        <small className="p-error">{addCMSFormik.errors[name]}</small>
      )
    );
  };

  // === get CMS data === ====
  const getCMSData = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}admin/getallcms`,
        {
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhlY2Y1OWMwZTVmNjJiM2ZkMWI4ZiIsImlhdCI6MTY2OTkxNzk0MX0.hWr6QfcSlsTWPOoEY4nLbFDmeGKLACewjacRMxuyQtE",
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        setCmsData(dt);
        // console.log("CMSData===>", dt);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  // ==== add user form === ===
  const addCMSForm = () => {
    return (
      <form onSubmit={addCMSFormik.handleSubmit}>
        <div className='form-demo card p-2'>
          <div className="row mx-3 mt-2">
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="title"
                  value={addCMSFormik.values.title}
                  onChange={addCMSFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isCMSFormFieldValid("title"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="title">Title<span className='text-danger'>*</span></label>
              </span>
              {getCMSFormErrorMessage("title")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="slug"
                  value={addCMSFormik.values.slug}
                  onChange={addCMSFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isCMSFormFieldValid("slug"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="slug">Slug<span className='text-danger'>*</span></label>
              </span>
              {getCMSFormErrorMessage("slug")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="section"
                  value={addCMSFormik.values.section}
                  onChange={addCMSFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isCMSFormFieldValid("section"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="section">Section<span className='text-danger'>*</span></label>
              </span>
              {getCMSFormErrorMessage("section")}
            </div>
          </div>
          <div className="row mx-3 mt-5">
            <span className="p-float-label">
              <InputTextarea
                id="editor"
                value={addCMSFormik.values.editor}
                onTextChange={addCMSFormik.handleChange}
                rows={4}
                className={
                  (classNames({
                    "p-invalid": isCMSFormFieldValid("section"),
                  }),
                    "p-inputtext-sm w-100 borderClass")
                }
              />
              <label htmlFor="editor">Description<span className='text-danger'>*</span></label>
              {getCMSFormErrorMessage("editor")}
            </span>
          </div>
          <div className="modal-footer d-flex justify-content-end my-3 mx-4">
            <Button
              label={viewMode === 1 ? "Add" : "Update"}
              type="submit"
              className="bg-primary border-0  p-button-md  btn-color p-button-raised"
            />
            <Button
              onClick={() => {
                setViewMode(0)
                addCMSFormik.resetForm();
              }}
              label={"Cancel"}
              style={{ marginLeft: "10px" }}
              className="bg-danger border-0 p-button-md p-button-raised"
            />
          </div>
        </div>
      </form>
    )
  }

  // ====  render header UI ==== =====
  const renderHeader = () => {
    return (
      <div className='row'>
        {/* <div className="flex justify-content-between align-items-center"> */}
        <div className='col-sm-8 col-md-8 col-lg-10'>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              // value={globalFilterValue} 
              // onChange={onGlobalFilterChange} 
              placeholder="Search"
            />
          </span>
        </div>
        <div className='col-sm-4 col-md-4 col-lg-2 justify-content-end'>
          <span >
            <Button
              label="Add"
              icon="pi pi-plus"
              className="p-button-raised p-button-text"
              onClick={() => {
                setViewMode(1);
              }}
            />
          </span>
        </div>
        {/* </div> */}
      </div >
    )
  }
  const header = renderHeader();

  // === description View ======
  const descriptionView = (rd) => {
    const disc = rd.description;
    return (
      <CTooltip content={disc} placement="bottom">
        <span>{disc.length > 30 ? disc.slice(0, 30) + "..." : disc}</span>
      </CTooltip>
    )
  }

  // === === rowClickHandelar ==== 
  const rowClickHandelar = (rd) => {
    const dt = rd.data;
    setViewMode(2);
    // console.log("rowData", dt)
    addCMSFormik.setFieldValue("title", dt.title);
    addCMSFormik.setFieldValue("slug", dt.slug);
    addCMSFormik.setFieldValue("section", dt.section)
    addCMSFormik.setFieldValue("editor", dt.description)
  }

  return (
    <div className="datatable-doc-demo">
      {viewMode === 1 || viewMode === 2 ? addCMSForm() :
        <div className="">
          <DataTable
            value={cmsData}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            rowHover
            // selection={selectedCustomers}
            onSelectionChange={e => setSelectedCustomers(e.value)}
            // filters={filters}
            filterDisplay="menu"
            loading={loading}
            responsiveLayout="scroll"
            onRowClick={rowClickHandelar}
            globalFilterFields={[
              'title',
              'slug',
              'section',
              'balance',
            ]}
            emptyMessage="No astrologers found"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              field="title"
              header="Title"
              sortable
              style={{ cursor: "pointer" }}
            />
            <Column
              field="slug"
              header="Slug"
              sortable
              style={{ cursor: "pointer" }}
            />
            <Column
              header="Section"
              field="section"
              sortable
              sortField="phone"
              filterField="representative"
              showFilterMatchModes={false}
              filterMenuStyle={{ width: '14rem' }}
              style={{ cursor: "pointer" }}
            />
            <Column
              field="description"
              header="Description"
              sortable
              style={{ cursor: "pointer" }}
              body={descriptionView}
            />
          </DataTable>
        </div>
      }
    </div>
  )
}

export default Cms