import React, { useState, useEffect } from 'react'
import { AppConstants, formatDate } from '../../../../constants/constants';
// import './users.css'
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState(null);
  const [viewMode, setViewMode] = useState(0);

  useEffect(() => {
    getTransactionData();
  }, [])

  // === get call data === ====
  const getTransactionData = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}admin/allTransaction`,
        {
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhlY2Y1OWMwZTVmNjJiM2ZkMWI4ZiIsImlhdCI6MTY2OTkxNzk0MX0.hWr6QfcSlsTWPOoEY4nLbFDmeGKLACewjacRMxuyQtE",
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        setTransactionData(dt);
        // console.log("chatssData===>", dt);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  // === === row details == ===
  const showRowDetails = () => {
    return (
      <div className='d-flex justify-content-between'>
        <span>Row details will show here</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setViewMode(0);
          }}
        ><i className="pi pi-times"></i></span>
      </div>
    )
  }

  // == === rowClickHandelar === ==
  const rowClickHandelar = (rd) => {
    const dt = rd.data;
    setViewMode(1);
    console.log("rowData", dt)
  }

  return (
    <div className="datatable-doc-demo">
      {viewMode === 1 ? showRowDetails() :
        <div className="">
          <DataTable
            value={transactionData}
            paginator
            className="p-datatable-customers"
            // header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            onSelectionChange={e => setSelectedCustomers(e.value)}
            dataKey="id"
            rowHover
            filterDisplay="menu"
            loading={loading}
            responsiveLayout="scroll"
            onRowClick={rowClickHandelar}
            globalFilterFields={[
              'memberPhone',
              'astroPhone',

              'astroId.name',
              'duration',
              'createdAt',
              'deducted',
              'chatPrice'
            ]}
            emptyMessage="No astrologers found"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              field="memberId.firstName"
              header="From"
              sortable
              style={{ cursor: "pointer" }}
              body={(rd) => `${rd.memberId.firstName} ${rd.memberId.lastName}`}
            />
            <Column
              field="astrologerId.name"
              header="To"
              sortable
              style={{ cursor: "pointer" }}
            />
            <Column
              field="mode"
              header="Mode"
              sortable
              style={{ cursor: "pointer" }}
            />
            <Column
              field="duration"
              header="Duration"
              sortable
              style={{textAlign: 'center', cursor: "pointer" }}
            />
            <Column
              field="deducted"
              header="Deducted"
              sortable
              style={{textAlign: 'center', cursor: "pointer" }}
            />
            <Column
              field="createdAt"
              header="Time"
              sortable
              showFilterMatchModes={false}
              style={{ textAlign: 'center', cursor: "pointer", width: '8rem' }}
              body={(rd) => formatDate(new Date(rd.createdAt))}
            />
            <Column
              header="Action"
              field="phone"
              sortable
              filterMenuStyle={{ width: '10rem' }}
              style={{ textAlign: 'center', cursor: "pointer", width: '8rem' }}
              body={(rd) => {
                const status = rd.status;
                return (
                  status == 1 ?
                    <span className='text-primary'><i className="pi pi-eye"></i></span> :
                    <i className="pi pi-eye-slash"></i>
                )
              }}
            />
          </DataTable>
        </div>}
    </div>
  )
}

export default Transactions