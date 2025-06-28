import React, { useState, useEffect, useRef } from 'react'
import { AppConstants, formatDate } from '../../../constants/constants';
import './users.css'
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from "react-redux";
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { setEditMOde } from '../../../redux/actions/editModeAction';
import { useDispatch } from 'react-redux';
import { Avatar } from 'primereact/avatar';
import {
    FaPencilAlt,
    FaPhoneAlt,
    FaLinkedin,
    FaEnvelope,
    FaMapMarkerAlt,
    FaTwitter,
    FaInstagram,
    FaFacebookSquare
} from 'react-icons/fa';
import { CTooltip } from '@coreui/react';
import { Rating } from 'primereact/rating';
import { mobileNoFormatter } from '../../../utils/validations'
import { setAstroViewMode } from '../../../redux/actions/astroViewModeAction'


const Staff = () => {
    // const userInfo = useSelector((state) => state.AuthReduer.token.data);
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [usersData, setUsersData] = useState(null);
    const [statusSwitch, setStatusSwitch] = useState(true);
    const [viewMode, setViewMode] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useRef(null);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     getUsersData();
    //     dispatch(setEditMOde({ editModeVal: 0, responce: "" }));
    //     dispatch(setAstroViewMode(0));
    // }, [])

    // === get report data === ====
    const getUsersData = async () => {
        await axios
            .get(`${AppConstants.Api_BaseUrl}users?limit=50&skip=0`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.data.reverse();
                setUsersData(dt);
                // console.log("users===>", dt);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
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
                    {/* <span >
                        <Button
                            label="Add"
                            icon="pi pi-plus"
                            className="p-button-raised p-button-text"
                            onClick={() => {
                                // setViewMode(1);
                                alert("Add user is under maintenance !!")
                            }}
                        />
                    </span> */}
                </div>
                {/* </div> */}
            </div >
        )
    }
    const header = renderHeader();

    const showRowDetails = () => {
        return (
            <div className='card'>
                <div className="row mx-2 my-2">
                    <div className="col-sm-12 col-md-6 col-lg-7 d-flex">
                        <div className="d-flex">
                            <div className="mt-3 ml-2">
                                {selectedUser.profileImage !== undefined ? (
                                    <img
                                        // src={selectedAstroData.profileImage}
                                        width={125}
                                        height={125}
                                        style={{ borderRadius: "50%" }}
                                    />
                                ) : (
                                    <Avatar
                                        label={selectedUser.firstname[0].toUpperCase()}
                                        className="mr-2"
                                        size="xlarge"
                                        shape="circle"
                                        style={{ fontSize: "4rem", width: "6rem", height: "6rem" }}
                                    />
                                )}
                            </div>
                            <div className="mx-3 mt-3">
                                <div style={{ marginBottom: "0.5rem" }}>
                                    <strong>
                                        {selectedUser.firstname + " " + selectedUser.lastname}
                                    </strong>
                                </div>
                                <CTooltip content="Phone Number" placement="top">
                                    <p
                                        style={{ marginBottom: "0.5rem" }}
                                        className="d-flex align-items-center"
                                    >
                                        <FaPhoneAlt className="text-success" />
                                        <span>&nbsp; {mobileNoFormatter(selectedUser.phone)}</span>
                                    </p>
                                </CTooltip>
                                <CTooltip content="Email Id" placement="top">
                                    <p
                                        style={{ marginBottom: "0.5rem" }}
                                        className="d-flex align-items-center"
                                    >
                                        <FaEnvelope />
                                        <span>&nbsp; {selectedUser.email}</span>
                                    </p>
                                </CTooltip>
                                <p className="d-flex align-items-center">
                                    <FaMapMarkerAlt className="text-danger" />
                                    <span>
                                        &nbsp;
                                        {selectedUser.address}
                                    </span>
                                </p>
                                {/* <p className="d-flex align-items-center">
                                <span>
                                    <Rating
                                        // value={Math.ceil(selectedAstroData.rating)}
                                        readOnly
                                        stars={5}
                                        cancel={false}
                                    />
                                </span>
                            </p> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-5 ">
                        <div
                            className="d-flex align-items-center"
                            style={{ marginBottom: "0.5rem " }}
                        >
                            <div className="d-flex align-items-center flex-fill">
                                <span style={{ fontSize: "1.1rem" }}>Role: </span> &nbsp;
                                {selectedUser.role}
                            </div>
                            <div className="d-flex align-items-center">
                                <CTooltip content="Close" placement="top">
                                    <i
                                        className="pi pi-times editBtn"
                                        style={{
                                            fontSize: "1.5em",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => {
                                            setViewMode(0)
                                        }}
                                    ></i>
                                </CTooltip>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between my-1">
                            <span>
                                Date of Birth:{" "}
                                {formatDate(new Date(selectedUser.birth_date))}
                            </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between" >
                            <span>
                                Time of Birth:{" "}
                                {selectedUser.birth_time}
                            </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between my-1" >
                            <span>
                                Place of Birth:{" "}
                                {selectedUser.birth_place}
                            </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between my-1" >
                            {/* <span>Following:&nbsp;{selectedAstroData.following.length}</span> */}
                            {/* <span>Followers:&nbsp;{selectedAstroData.followers.length}</span> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <>
            <Toast ref={toast} />
            <div className="datatable-doc-demo">
                <div className="">
                    <DataTable
                        value={usersData}
                        paginator
                        className="p-datatable-customers"
                        header={header}
                        rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]}
                        dataKey="id"
                        rowHover
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        globalFilterFields={[
                            'firstname',
                            'email',
                            'representative.name',
                            'balance',
                            'callPrice',
                            'status',
                            'chatPrice',
                            'birth_date',
                            'birth_time',
                            'birth_place',
                            'role',
                        ]}
                        emptyMessage="No users found"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    >
                        <Column
                            field="name"
                            header="Name"
                            sortable
                            body={(rd) => `${rd.firstname} ${rd.lastname}`}
                        />
                        {/* <Column
                            field="email"
                            header="Email"
                            sortable
                        /> */}
                        <Column
                            header="Phone No."
                            field="phone"
                            sortable
                        />
                        {/* <Column
                            field="wallet_balance"
                            header="Wallet Balance"
                            sortable
                        /> */}
                        {/* <Column
                            field="amount_spend"
                            header="Amount Spend"
                            sortable
                        /> */}
                        {/* <Column
                            field="orders"
                            header="Orders"
                            sortable
                        /> */}
                        {/* <Column
                            field="calls"
                            header="Calls"
                            sortable
                        /> */}
                        {/* <Column
                            field="chats"
                            header="Chats"
                            sortable
                        /> */}
                        {/* <Column
                            field="e_com"
                            header="E-com"
                            sortable
                        />
                        <Column
                            field="total_minutes"
                            header="Total Minutes"
                            sortable
                        /> */}
                        <Column
                            field="staus"
                            header="Staus"
                            sortable
                        />
                    </DataTable>
                </div>
            </div>
        </>
    )
}

export default Staff