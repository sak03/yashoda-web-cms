import React, { useState, useEffect } from 'react'
import axios from "axios";
import { AppConstants } from '../../../../constants/constants';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import { setAstroViewMode } from '../../../../redux/actions/astroViewModeAction';
import { setSelectedAstro } from '../../../../redux/actions/selectedAstroAction'
import AstroDetails from './AstroDetails';
import AstroAddUpdateForm from './AstroAddUpdateForm';
import { setEditMOde } from '../../../../redux/actions/editModeAction'


const UnverifiedAsro = () => {
    const [astrologerData, setAstrologerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const viewMode = useSelector((state) => state.astroViewMove)
    const dispatch = useDispatch();
    useEffect(() => {
        getAstrologersData();
        dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
    }, [])

    // === get report data === ====
    const getAstrologersData = async () => {
        await axios
            .get(`${AppConstants.Api_BaseUrl}admin/getAllAstrologers?page=1&limit=1000`,
                {
                    headers: {
                        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhlY2Y1OWMwZTVmNjJiM2ZkMWI4ZiIsImlhdCI6MTY2OTkxNzk0MX0.hWr6QfcSlsTWPOoEY4nLbFDmeGKLACewjacRMxuyQtE",
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.results;
                const unVerified = dt.filter((item) => {
                    return item.approved == 0
                })
                setAstrologerData(unVerified);
                // console.log("astrologers===>", dt)
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
            <div className="flex justify-content-between align-items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        // value={globalFilterValue} 
                        // onChange={onGlobalFilterChange} 
                        placeholder="Search"
                    />
                </span>
            </div>
        )
    }
    const header = renderHeader();

    // === row click handelar === ====
    const rowClickHandelar = (rowData) => {
        dispatch(setAstroViewMode(1));
        dispatch(setSelectedAstro(rowData.data))
        console.log("rowData", rowData.data)
    }

    return (
        <>
            {viewMode === 1 ? <AstroDetails /> : viewMode === 2 || viewMode === 3 ? <AstroAddUpdateForm /> :
                <div className="datatable-doc-demo">
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
                            onSelectionChange={e => setSelectedCustomers(e.value)}
                            // filters={filters}
                            filterDisplay="menu"
                            loading={loading}
                            responsiveLayout="scroll"
                            onRowClick={rowClickHandelar}
                            globalFilterFields={['name',
                                'email',
                                'representative.name',
                                'balance',
                                'callPrice',
                                'status',
                                'chatPrice'
                            ]}
                            emptyMessage="No astrologers found"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        >
                            <Column
                                field="name"
                                header="Name"
                                sortable
                                style={{ cursor: "pointer" }}
                            />
                            <Column
                                field="email"
                                header="Email"
                                sortable
                                filterField="email"
                                style={{ cursor: "pointer" }}
                                filterPlaceholder="Search by country" />
                            <Column
                                header="Phone No."
                                field="phone"
                                sortable
                                sortField="phone"
                                filterField="representative"
                                style={{ cursor: "pointer" }}
                                showFilterMatchModes={false}
                                filterMenuStyle={{ width: '14rem' }}
                            />
                            <Column
                                field="callPrice"
                                header="Call Price"
                                sortable
                                filterField="callPrice"
                                dataType="date"
                                style={{ textAlign: 'center', cursor: "pointer" }}
                                body={(rd) => {
                                    const callPrice = rd.callPrice;
                                    return (
                                        callPrice !== undefined ? <span>{callPrice}</span> : <span>N/A</span>
                                    )
                                }}
                            />
                            <Column
                                field="chatPrice"
                                header="Chat Price"
                                sortable
                                filterMenuStyle={{ width: '14rem' }}
                                style={{ textAlign: 'center', cursor: "pointer" }}
                                body={(rd) => {
                                    const chatPrice = rd.chatPrice;
                                    return (
                                        chatPrice !== undefined ? <span>{chatPrice}</span> : <span>N/A</span>
                                    )
                                }}
                            />
                            <Column
                                field="status"
                                header="Status"
                                sortable
                                style={{ cursor: "pointer" }}
                                showFilterMatchModes={false}
                                body={(rd) => {
                                    const status = rd.status;
                                    return (
                                        status == 1 ? <span className='text-success'>Active</span> : <span className='text-danger'>Inactive</span>
                                    )
                                }}
                            />
                        </DataTable>
                    </div>
                </div>}
        </>
    )
}

export default UnverifiedAsro