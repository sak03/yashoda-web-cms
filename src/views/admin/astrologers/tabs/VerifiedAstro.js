import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { AppConstants } from '../../../../constants/constants';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { setAstroViewMode } from '../../../../redux/actions/astroViewModeAction';
import AstroDetails from './AstroDetails';
import AstroAddUpdateForm from './AstroAddUpdateForm';
import { setSelectedAstro } from '../../../../redux/actions/selectedAstroAction'
import { Toast } from 'primereact/toast';
import { setEditMOde } from '../../../../redux/actions/editModeAction'
import { circlesWithBar } from '../../../../utils/loaders'
import { mobileNoFormatter } from '../../../../utils/validations'
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { CTooltip } from '@coreui/react';
import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { statusList } from '../../../../utils/dropDownData'


const VerifiedAstro = () => {
    const selectedAstroData = useSelector((state) => state.selectedAstro);
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const editMode = useSelector((state) => state.editMode)
    const [astrologerData, setAstrologerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const viewMode = useSelector((state) => state.astroViewMove)
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    useEffect(() => {
        getAstrologersData();
        if (viewMode === 1) {
            getAstrologersData();
        }
    }, [viewMode]);



    // === get astrologers data === ====
    const getAstrologersData = async () => {
        setLoading(true);
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
                setAstrologerData(dt);
                // if (editMode.editModeVal === 2 && editMode.responce.data) {
                //     showAddMessage('success', "");
                // }
                // if (editMode.editModeVal === 2 && editMode.responce.error) {
                //     showAddMessage('error', editMode.responce.error)
                // }
                // if (editMode.editModeVal === 3 && editMode.responce.data) {
                //     showUpdateMessage('success', "")
                // }
                // if (editMode.editModeVal === 3 && editMode.responce.error) {
                //     showUpdateMessage('error', editMode.responce.error)
                // }
                // console.log("astrologers===>", dt);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    // === delete astrologers data === ====
    const deleteAstrologers = async () => {
        // setLoader(true);

        await axios
            .delete(`${AppConstants.Api_BaseUrl}astrologers/${selectedAstroData._id}`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                if (dt.data) {
                    toast.current.show({
                        severity: 'success',
                        summary: "Deleted",
                        detail: 'Astrologer has been successfully deleted',
                        life: 3000
                    });
                    getAstrologersData();
                    // setLoader(false);
                }
                if (dt.error) {
                    toast.current.show({
                        severity: 'error',
                        summary: "Oops",
                        detail: 'Something went wrong',
                        life: 3000
                    });
                    getAstrologersData();
                    // setLoader(false);
                    console.log("res", dt.error)
                    // dispatch(setEditMOde({ editModeVal: 3, responce: dt }));
                }
            })
    }

    // ====  render header UI ==== =====
    const renderHeader = () => {
        return (
            <div className='d-flex justify-content-between'>
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
                                dispatch(setAstroViewMode(2))
                            }}
                        />
                    </span>
                </div>
            </div >
        )
    }
    const header = renderHeader();

    const actionHandel = () => {
        return (
            <div className='d-flex'>
                <CTooltip content='Edit' position='left'>
                    <span
                        className='text-primary mx-2'
                        onClick={() => {
                            dispatch(setAstroViewMode(3));
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <FaRegEdit />
                    </span>
                </CTooltip>
                <CTooltip content='Delete' position='left'>
                    <span
                        className='text-danger'
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            setVisible(true);
                            // e.stopPropagation()
                        }}
                    >
                        <FaTrashAlt />
                    </span>
                </CTooltip>
            </div>
        )
    }

    // === row click handelar === ====
    const rowClickHandelar = (rowData) => {
        // dispatch(setAstroViewMode(3));
        // alert("This function is under process");
        dispatch(setSelectedAstro(rowData.data))
        // console.log("rowData", rowData.data)
    }

    const accept = () => {
        deleteAstrologers();
        // console.log("accepted");
    }

    const reject = () => {
        toast.current.show({
            severity: 'warn',
            summary: 'Rejected',
            detail: 'Astrologer not deleted.',
            life: 3000
        });
    }


    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                message="Do you really want to delete this astrologer?"
                header="Delete Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={() => {
                    // deleteProductDesignsData();
                    accept();
                }}
                reject={reject}
            />
            {viewMode === 1 ? <AstroDetails /> : viewMode === 2 || viewMode === 3 ? <AstroAddUpdateForm /> :
                <div className="datatable-doc-demo">
                    {loading === true ?
                        <span
                            style={{ position: "relative", left: "20rem" }}
                        >
                            {circlesWithBar()}
                        </span> :
                        <div className="">
                            <DataTable
                                value={astrologerData}
                                paginator
                                className="p-datatable-customers"
                                header={header}
                                rows={10}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                rowsPerPageOptions={[10, 25, 50]}
                                dataKey="id"
                                rowHover
                                // selection={selectedCustomers}
                                // onSelectionChange={e => setSelectedCustomers(e.value)}
                                // filters={filters}
                                filterDisplay="menu"
                                // loading={loading}
                                responsiveLayout="scroll"
                                onRowClick={rowClickHandelar}
                                globalFilterFields={['name',
                                    'email',
                                    'representative.name',
                                    'balance',
                                    'call_price',
                                    'status',
                                    'chat_price',
                                    'user_name',
                                    'address.state'
                                ]}
                                emptyMessage="No astrologers found"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            >
                                <Column
                                    field="name"
                                    header="Real Name"
                                    sortable
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field="user_name"
                                    header="JY-Name"
                                    sortable
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    header="Mobile"
                                    field="phone"
                                    body={(rd) => mobileNoFormatter(rd.phone)}
                                    sortable
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field="address.state"
                                    header="Location"
                                    sortable
                                    filterField="email"
                                    filterPlaceholder="Search by country"
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field="status"
                                    header="Status"
                                    sortable
                                    showFilterMatchModes={false}
                                    // style={{ cursor: "pointer" }}
                                    body={(rd) => {
                                        const status = statusList.filter((item)=>{
                                            return item.code === rd.status
                                        }) ;
                                        return (
                                            <span className={rd.status ===
                                                "pending" ? 'text-primary' : rd.status ===
                                                "approved" ? "text-success": "text-danger"}>{status[0].name}</span>
                                        )
                                    }}
                                />
                                <Column
                                    field=""
                                    header="Revenue"
                                    sortable
                                // style={{ cursor: "pointer" }}
                                // body={(rowData) => {
                                //     return rowData.profile_image !== undefined ? <img width={30} src={`${rowData?.profile_image}`} alt="profile" /> :
                                //         <Avatar label={rowData.name.charAt(0).toUpperCase()} className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />;
                                // }}
                                />
                                <Column
                                    field=""
                                    header="Reviews"
                                    sortable
                                    filterField="email"
                                    filterPlaceholder="Search by country"
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field=""
                                    header="Total Orders"
                                    sortable
                                    filterField="email"
                                    filterPlaceholder="Search by country"
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field=""
                                    header="Payout Status"
                                    sortable
                                // style={{ textAlign: 'center', cursor: "pointer" }}
                                />
                                <Column
                                    field=""
                                    header="Action"
                                    body={actionHandel}
                                // sortable
                                // style={{ textAlign: 'center', cursor: "pointer" }}
                                />
                            </DataTable>
                        </div>}
                </div>}
        </>
    )
}

export default VerifiedAstro
