import React, { useState, useEffect, useRef } from 'react'
import { AppConstants, formatDate } from '../../../constants/constants';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { setEditMOde } from '../../../redux/actions/editModeAction';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { classNames } from "primereact/utils";
import './offer.css';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { CTooltip } from '@coreui/react';
import { InputSwitch } from 'primereact/inputswitch';


const Offers = () => {
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [offerData, setOfferData] = useState(null);
    const [viewMode, setViewMode] = useState(0);
    const dispatch = useDispatch();
    const maxYear = new Date().getFullYear();
    const toast = useRef(null);
    const [selectedData, setSelectedData] = useState(null)
    const [statusSwitch, setStatusSwitch] = useState(true);


    const userType = [
        { name: "New", code: "new" },
        { name: "All", code: "all" }
    ]


    useEffect(() => {
        getOffersData();
        dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
    }, [])

    const offerFormik = useFormik({
        initialValues: {
            offerName: "",
            offerCode: "",
            startDate: '',
            endDate: "",
            userType: "",
            discountPercentage: ""
        },
        validate: (data) => {
            let errors = {};

            //===== row first =======
            if (!data.offerName) {
                errors.offerName = "Please enter offer name";
            }
            if (!data.offerCode) {
                errors.offerCode = "Please enter offer code";
            }
            if (!data.startDate) {
                errors.startDate = "Please select start date";
            }
            if (!data.endDate) {
                errors.endDate = "Please enter end date";
            }
            if (!data.userType) {
                errors.userType = "Please enter user type";
            }
            if (!data.discountPercentage) {
                errors.discountPercentage = "Please enter discount percentage";
            }


            return errors;
        },
        onSubmit: (data) => {
            // console.log("formikData", data);
            viewMode === 1 ? createOfferData(data) : updateOfferData(data);
            // viewMode === 1 ? createBlogData(data) : updateBlogData(data, "");
        },
    });
    const isOfferFormFieldValid = (name) =>
        !!(offerFormik.touched[name] && offerFormik.errors[name]);
    const getOfferFormErrorMessage = (name) => {
        return (
            isOfferFormFieldValid(name) && (
                <small className="p-error">{offerFormik.errors[name]}</small>
            )
        );
    };

    // === get payout data === ====
    const getOffersData = async () => {
        await axios
            .get(`${AppConstants.Api_BaseUrl}offers`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.data;
                setOfferData(dt);
                // console.log("offerData===>", dt);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    // === get blog data === ====
    const createOfferData = async (data) => {
        setLoading(true);
        const postData = {
            name: data.offerName,
            code: data.offerCode,
            start_date: data.startDate,
            end_date: data.endDate,
            user_type: data.userType,
            offer_type: "percentage",
            discount_percentage: +data.discountPercentage
        }
        console.log("postData", postData);
        await axios
            .post(`${AppConstants.Api_BaseUrl}offers`, postData,
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
                    offerFormik.resetForm();
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

    // === get blog data === ====
    const updateOfferData = async (data) => {
        setLoading(true);
        const postData = {
            name: data.offerName,
            code: data.offerCode,
            start_date: data.startDate,
            end_date: data.endDate,
            user_type: data.userType,
            offer_type: "percentage",
            discount_percentage: +data.discountPercentage
        }
        console.log("postData", postData);
        await axios
            .put(`${AppConstants.Api_BaseUrl}offers/${selectedData._id}`, postData,
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
                    offerFormik.resetForm();
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
                showSuccessMessage('error', err.message);
                setLoading(false);
            })
    }

    const addOfferForm = () => {
        return (
            <form onSubmit={offerFormik.handleSubmit}>
                <div className='form-demo card p-2'>
                    <div className="d-flex justify-content-between my-2 mx-4">
                        <p className="text-primary">
                            <CTooltip content='Back' position='left'>
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setViewMode(0);
                                        offerFormik.resetForm();
                                        // setFilterDesignData(null);
                                    }}
                                >
                                    <i className="pi pi-arrow-left mr-2"></i>
                                </span>
                            </CTooltip>
                        </p>
                        <div className="d-flex mr-1 align-items-center">
                            <p className="para-publish mt-3 mx-1">Status</p>
                            <InputSwitch
                                id="status"
                                name="status"
                                style={{ height: "1.35rem" }}
                                checked={statusSwitch}
                                onChange={(e) => setStatusSwitch(e.value)}
                            />
                        </div>
                    </div>
                    <div className="row mx-3 mt-2">
                        <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="offerName"
                                    value={offerFormik.values.offerName}
                                    onChange={offerFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isOfferFormFieldValid("offerName"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="offerName">Offer Name<span className='text-danger'>*</span></label>
                            </span>
                            {getOfferFormErrorMessage("offerName")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="offerCode"
                                    value={offerFormik.values.offerCode}
                                    onChange={offerFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isOfferFormFieldValid("offerCode"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="offerCode">Offer Code<span className='text-danger'>*</span></label>
                            </span>
                            {getOfferFormErrorMessage("offerCode")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="discountPercentage"
                                    value={offerFormik.values.discountPercentage}
                                    // onChange={offerFormik.handleChange}
                                    onChange={(e) => {
                                        offerFormik.handleChange(e);
                                        const val = e?.target?.value?.replace(/[^\d]/g, "");
                                        // console.log("numVal",  val)
                                        offerFormik.setFieldValue('discountPercentage', val);
                                    }}
                                    className={
                                        (classNames({
                                            "p-invalid": isOfferFormFieldValid("discountPercentage"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="discountPercentage">Discount Percentage<span className='text-danger'>*</span></label>
                            </span>
                            {getOfferFormErrorMessage("discountPercentage")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
                            <span className="p-float-label">
                                <Dropdown
                                    id="userType"
                                    inputId="dropdown"
                                    options={userType}
                                    value={offerFormik.values.userType}
                                    onChange={offerFormik.handleChange}
                                    optionLabel="name"
                                    optionValue='code'
                                    className={
                                        (classNames({
                                            "p-invalid": isOfferFormFieldValid("userType"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="userType">User Type<span className='text-danger'>*</span></label>
                            </span>
                            {getOfferFormErrorMessage("userType")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
                            <span className="p-float-label">
                                <Calendar
                                    id="startDate"
                                    yearNavigator
                                    yearRange={`2022:${maxYear}`}
                                    // showButtonBar
                                    value={offerFormik.values.startDate}
                                    onChange={offerFormik.handleChange}
                                    dateFormat="d M, yy"
                                    className={
                                        (classNames({
                                            "p-invalid": isOfferFormFieldValid("startDate"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="startDate">Start Date<span className='text-danger'>*</span></label>
                            </span>
                            {getOfferFormErrorMessage("startDate")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
                            <span className="p-float-label">
                                <Calendar
                                    id="endDate"
                                    yearNavigator
                                    yearRange={`2022:${maxYear}`}
                                    // showButtonBar
                                    value={offerFormik.values.endDate}
                                    onChange={offerFormik.handleChange}
                                    dateFormat="d M, yy"
                                    className={
                                        (classNames({
                                            "p-invalid": isOfferFormFieldValid("endDate"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="endDate">End Date<span className='text-danger'>*</span></label>
                            </span>
                            {getOfferFormErrorMessage("endDate")}
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
                                offerFormik.resetForm();
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
            summary: severity === 'success' ? viewMode === 1 ? 'Added' : "Updated" : 'Oops',
            detail: severity === 'success' ? `Offer has been successfully ${viewMode === 1 ? 'added' : 'updated'}` : errMsg,
            life: 3000
        });
    }

    // ====  render header UI ==== =====
    const renderHeader = () => {
        return (
            <div className='d-flex justify-content-between'>
                {/* <div className="flex justify-content-between align-items-center"> */}
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

    //==== row click handler===========
    const rowClickHandelar = (rd) => {
        const dt = rd.data;
        // console.log("rowData", rd.data);
        setSelectedData(dt);
        setViewMode(2);
        offerFormik.setFieldValue("offerName", dt.name);
        offerFormik.setFieldValue("offerCode", dt.code);
        offerFormik.setFieldValue("startDate", new Date(dt.start_date));
        offerFormik.setFieldValue("endDate", new Date(dt.end_date));
        offerFormik.setFieldValue("userType", dt.user_type);
        offerFormik.setFieldValue("discountPercentage", dt.discount_percentage);
    }

    return (
        <>
            <Toast ref={toast} />
            {viewMode === 1 || viewMode === 2 ? addOfferForm() :
                <div className="datatable-doc-demo">
                    <div className="">
                        <DataTable
                            value={offerData}
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
                            // loading={loading}
                            responsiveLayout="scroll"
                            onRowClick={rowClickHandelar}
                            globalFilterFields={[
                                'name',
                                'user_type',
                                'code',
                                'start_date',
                                'end_date',
                                'is_active',
                            ]}
                            emptyMessage="No astrologers found"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        >
                            <Column
                                field="name"
                                header="Offers"
                                sortable
                                style={{ cursor: "pointer" }}
                            />
                            <Column
                                field="user_type"
                                header="Offer For"
                                sortable
                                style={{ cursor: "pointer" }}
                            />
                            <Column
                                field="code"
                                header="Offer Code"
                                sortable
                                style={{ cursor: "pointer" }}
                            />
                            <Column
                                field="start_date"
                                header="Valid From"
                                sortable
                                body={(rd) => formatDate(new Date(rd.start_date))}
                                style={{ cursor: "pointer" }}
                            />
                            <Column
                                header="Valid To"
                                field="end_date"
                                sortable
                                body={(rd) => formatDate(new Date(rd.end_date))}
                                style={{ cursor: "pointer" }}
                            />
                            <Column
                                field="is_active"
                                header="Status"
                                sortable
                                style={{ cursor: "pointer" }}
                                body={(rd) => {
                                    const status = rd.is_active == true ? "Active" : "Inactive";
                                    return (
                                        <span className={rd.is_active == true ? 'text-success' : "text-danger"}>{status}</span>
                                    )
                                }}
                            />
                        </DataTable>
                    </div>
                </div>}
        </>
    )
}

export default Offers