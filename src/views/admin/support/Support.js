import React, { useState, useEffect, useRef } from 'react'
import { AppConstants, formatDate } from '../../../constants/constants';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { circlesWithBar } from '../../../utils/loaders'
import { Divider } from 'primereact/divider';
import { removeAuthToken } from 'src/redux/actions/authTokenAction';
import { InputText } from 'primereact/inputtext';
// import io from 'socket.io-client';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import Socket from './Socket';


const Support = () => {
  const userInfo = JSON.parse(localStorage.getItem('token'));
  const [loading, setLoading] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [inputTextMsg, setInputTextMsg] = useState();
  const [messageData, setMessageData] = useState(null);
  // const socket = useSelector((state)=> state.sucketUrl)
  // const [socket, setSocket] = useState(null)

  const [messages, setMessages] = useState([]);



  // console.log("socketUrl", socket)

  // useEffect(() => {
  //   getTicketList();
  // }, []);


  // ======= get all ticket list =====
  const getTicketList = async () => {
    setLoading(true);
    await axios
      .get(`${AppConstants.Api_BaseUrl}tickets`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        setTicketData(dt);
        // console.log("tickets===>", dt);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  const rowClickHandelar = (rd) => {
    const dt = rd.data;
    setSelectedRowData(dt);
  }



  return (
    <div className='row d-flex'>
      <div className='col-sm-12 col-md-8 col-lg-8'>
        <div className="datatable-doc-demo">
          <div className="">
            {loading === true ? circlesWithBar() :
              <DataTable
                value={ticketData}
                paginator
                className="p-datatable-customers"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                // header={header}
                rows={10}
                rowsPerPageOptions={[10, 25, 50]}
                dataKey="id"
                rowHover
                filterDisplay="menu"
                responsiveLayout="scroll"
                onRowClick={rowClickHandelar}
                globalFilterFields={[
                  'user.name',
                  'category',
                  'issue',
                  'created_at',
                  'status'
                ]}
                emptyMessage="No blogs found"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
                <Column
                  field="user.name"
                  header="Name"
                  sortable
                  style={{ cursor: "pointer" }}
                />
                <Column
                  field="created_at"
                  header="Created Date"
                  body={(rd) => formatDate(new Date(rd.created_at))}
                  sortable
                  style={{ cursor: "pointer" }}
                />
                <Column
                  header="Issue"
                  field="issue"
                  body={(rd) => {
                    return (
                      <span >{rd.issue.length > 25 ? `${rd.issue.slice(0, 25)} ...` : rd.issue}</span>
                    )
                  }}
                  sortable
                  style={{ cursor: "pointer" }}
                />
                <Column
                  header="Status"
                  field="status"
                  body={(rd) => {
                    return (
                      <span >
                        {rd.status == "closed" ?
                          <span className='text-danger'>Closed</span> :
                          rd.status === "Open" || rd.status === "open" ? <span className='text-success'>Open</span> : rd.status}
                      </span>
                    )
                  }}
                  sortable
                />
              </DataTable>}
          </div>
        </div>
      </div>
      <div className='col-sm-12 col-md-4 col-lg-4'>
        <Socket selectedRowData={selectedRowData} />
        {/* <div className='card p-3' style={{ height: "12vh" }}>
          {selectedRowData !== null ?
            <div style={{ height: "7.5vh" }}>
              <div className='d-flex justify-content-between'>
                <span> <strong>Name:</strong> {selectedRowData.user.name}</span>
                <span> <strong>Status:</strong> {statusHandler(selectedRowData.status)}</span>
              </div>
              <div className='my-2'> <strong>Issue:</strong> {selectedRowData.issue}</div>
            </div> :
            <span className='mx-5 my-3'>No conversations selected</span>}
        </div>
        <div>
          <div className='card px-2 py-1 bg-dark' style={{ height: "67vh", overflow: "auto" }}>
            {messageData !== undefined || messageData.length !== 0 || messageData !== null ?
              messageData?.map((item) => (
                <div
                  className='w-75 card rounded my-1'
                  style={{
                    backgroundColor: userInfo._id === item.sender_id ? "" : "rgb(195 229 235 / 58%)",
                    position: "relative",
                    left: userInfo._id === item.sender_id ? "6.5rem" : "0rem"
                  }}
                >
                  <div className='d-flex justify-content-between mx-2 my-1'>
                    <span>{item.message}</span>
                    <small className='text-muted'>{formatDate(new Date(item.created_at))}</small>
                  </div>
                </div>
              ))
              : <span>Start conversation</span>}
          </div>
          <form >
            <span className="p-input-icon-right w-100">
              <i className="pi pi-send text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // console.log("inputTextMsg", inputTextMsg);
                  handleSendMessage();
                }}
              />
              <InputText
                id="title"
                value={inputTextMsg}
                onChange={(e) => {
                  setInputTextMsg(e.target.value);
                  // console.log("textValue", e.target.value)
                }}
                // className={
                //   (classNames({
                //     "p-invalid": isBlogFormFieldValid("title"),
                //   }),
                //     "p-inputtext-sm w-100 borderClass")
                // }
                placeholder='Write your message'
                disabled={selectedRowData === null ? true : false}
              />
            </span>
          </form>
        </div> */}
      </div>
    </div>
  )
}

export default Support