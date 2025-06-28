import React, { useState, useEffect, useRef } from 'react'
import { AppConstants, formatDate } from '../../../constants/constants';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { CTooltip } from '@coreui/react';
import { setEditMOde } from '../../../redux/actions/editModeAction';
import './payout.css'
import { useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { classNames } from "primereact/utils";
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';



const Payout = () => {
  const userInfo = JSON.parse(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [payoutData, setPayoutData] = useState(null);
  const [viewMode, setViewMode] = useState(0);
  const dispatch = useDispatch();
  const toast = useRef(null);
  // const maxYear = new Date().getFullYear();
  const [astrologerData, setAstrologerData] = useState(null)


  useEffect(() => {
    getPayoutData();
    getAstrologersList();
    dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
  }, [])

  const payoutFormik = useFormik({
    initialValues: {
      astrologer: "",
      amount: "",
      message: ""
    },
    validate: (data) => {
      let errors = {};

      //===== row first =======
      if (!data.astrologer) {
        errors.astrologer = "Please select astrologer";
      }
      if (!data.amount) {
        errors.amount = "Please enter amount";
      }
      if (!data.message) {
        errors.message = "Please enter message";
      }


      return errors;
    },
    onSubmit: (data) => {
      // console.log("formikData", data);
      // createPayoutData(data);
      alert('Add payout is under maintenance');
    },
  });
  const isPayoutFormFieldValid = (name) =>
    !!(payoutFormik.touched[name] && payoutFormik.errors[name]);
  const getPayoutFormErrorMessage = (name) => {
    return (
      isPayoutFormFieldValid(name) && (
        <small className="p-error">{payoutFormik.errors[name]}</small>
      )
    );
  };

  // === get astrologers data === ====
  const getAstrologersList = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}astrologers?limit=50&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res?.data?.data;
        const ndt = dt?.map((item) => {
          return { name: item.name, code: item._id }
        })
        setAstrologerData(ndt);
        // console.log("astrologers===>", ndt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // === get payout data === ====
  const getPayoutData = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}payouts/list`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        setPayoutData(dt);
        // console.log("payout===>", dt);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  // === get blog data === ====
  const createPayoutData = async (data) => {
    setLoading(true);
    const postData = {
      astrologer_id: data.astrologer,
      amount: data.amount,
      message: data.message
    }
    console.log("postData", postData);
    await axios
      .post(`${AppConstants.Api_BaseUrl}payouts/create`, postData,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        if (dt.data) {
          getOffersData();
          setViewMode(0);
          payoutFormik.resetForm();
          showSuccessMessage('success', '');
        }
        if (dt.error) {
          console.log('error', dt.error);
          showSuccessMessage('error', dt.error.message);
        }
        // console.log("res", dt)
      })
      .catch((err) => {
        console.log(err);
        showSuccessMessage('error');
        setLoading(false);
      })
  }

  const addOfferForm = () => {
    return (
      <form onSubmit={payoutFormik.handleSubmit}>
        <div className='form-demo card p-2'>
          <div className="d-flex justify-content-between my-2 mx-4">
            <p className="text-primary">
              <CTooltip content='Back' position='left'>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setViewMode(0);
                    payoutFormik.resetForm();
                    // setFilterDesignData(null);
                  }}
                >
                  <i className="pi pi-arrow-left mr-2"></i>
                </span>
              </CTooltip>
            </p>
            <div className="d-flex mr-1 align-items-center">
              {/* <p className="para-publish mt-3 mx-1">Status</p>
              <InputSwitch
                id="status"
                name="status"
                style={{ height: "1.35rem" }}
                checked={statusSwitch}
                onChange={(e) => setStatusSwitch(e.value)}
              /> */}
            </div>
          </div>
          <div className="row mx-3 mt-2">
            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="astrologer"
                  inputId="dropdown"
                  options={astrologerData}
                  value={payoutFormik.values.astrologer}
                  onChange={payoutFormik.handleChange}
                  optionLabel="name"
                  optionValue='code'
                  className={
                    (classNames({
                      "p-invalid": isPayoutFormFieldValid("astrologer"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="astrologer">Astrologer<span className='text-danger'>*</span></label>
              </span>
              {getPayoutFormErrorMessage("astrologer")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
              <span className="p-float-label">
                <InputText
                  id="amount"
                  value={payoutFormik.values.amount}
                  // onChange={payoutFormik.handleChange}
                  onChange={(e) => {
                    payoutFormik.handleChange(e);
                    const val = e?.target?.value?.replace(/[^\d]/g, "");
                    // console.log("numVal",  val)
                    payoutFormik.setFieldValue('amount', val);
                  }}
                  className={
                    (classNames({
                      "p-invalid": isPayoutFormFieldValid("amount"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="amount">Amount<span className='text-danger'>*</span></label>
              </span>
              {getPayoutFormErrorMessage("amount")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-12 mt-4">
              <span className="p-float-label">
                <InputText
                  id="message"
                  value={payoutFormik.values.message}
                  onChange={payoutFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isPayoutFormFieldValid("message"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="message">Message<span className='text-danger'>*</span></label>
              </span>
              {getPayoutFormErrorMessage("message")}
            </div>
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
                payoutFormik.resetForm();
              }}
              label={"Cancel"}
              style={{ marginLeft: "10px" }}
              className="bg-danger border-0 p-button-md p-button-raised"
            />
          </div>
        </div>
      </form >
    )
  }

  // ====== show successfull message ===
  const showSuccessMessage = (severity, errMsg) => {
    toast.current.show({
      severity: severity === 'success' ? 'success' : 'error',
      summary: severity === 'success' ? 'Added' : 'Oops',
      detail: severity === 'success' ? `Offer has been successfully added` : errMsg,
      life: 3000
    });
  }

  // ====  render header UI ==== =====
  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className=''>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              // value={globalFilterValue} 
              // onChange={onGlobalFilterChange} 
              placeholder="Search"
            />
          </span>
        </div>
        <div className=''>
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

  // === message View ======
  const messageView = (rd) => {
    const msg = rd.message;
    return (
      <CTooltip content={msg} placement="bottom">
        <span>{msg.length > 30 ? msg.slice(0, 30) + "..." : msg}</span>
      </CTooltip>
    )
  }


  return (
    <>
      <Toast ref={toast} />
      {viewMode === 1 ? addOfferForm() :
        <div className="datatable-doc-demo">
          <div className="">
            <DataTable
              value={payoutData}
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
              // onRowClick={rowClickHandelar}
              globalFilterFields={[
                'name',
                'email',
                'amount',
                'message',
                'status',
              ]}
              emptyMessage="No astrologers found"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
              <Column
                field="name"
                header="Name"
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="email"
                header="Email"
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                header="Payout Amount"
                field="amount"
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="message"
                header="Message"
                sortable
                body={messageView}
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="status"
                header="Status"
                sortable
                // style={{ cursor: "pointer" }}
                body={(rd) => {
                  const status = rd.status == "paid" ? "Paid" : "Pending";
                  return (
                    <span className={rd.status == "paid" ? 'text-success' : "text-danger"}>{status}</span>
                  )
                }}
              />
            </DataTable>
          </div>
        </div>}
    </>
  )
}

export default Payout