import React, { useEffect, useState } from 'react'
import './orders.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import Calls from './tabs/Calls';
import Chats from './tabs/Chats';
import Transactions from './tabs/Transactions';
import Recharge from './tabs/Recharge';
import { setAstroViewMode } from '../../../redux/actions/astroViewModeAction'
import { useDispatch, useSelector } from 'react-redux';
import { AppConstants, formatDate } from '../../../constants/constants';
import axios from 'axios';


const Students = () => {
  // const userInfo = useSelector((state) => state.AuthReduer.token.data);
  const userInfo = JSON.parse(localStorage.getItem('token'));
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState(null);
  const [ecomData, setEcomData] = useState(null);
  const [callsData, setCallsData] = useState(null);
  const [chatsData, setChatsData] = useState(null);
  const [activeCell, setActiveCell] = useState(0);
  const [viewMode, setViewMOde] = useState(0);

  useEffect(() => {
    dispatch(setAstroViewMode(0));
    getOrdersData();
  }, [])

  // === get call data === ====
  const getOrdersData = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}orders/count/all`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        setOrderData(dt);
        // console.log("callsData===>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // === get call data === ====
  const getTotalList = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}orders?order_source=chat&status=cancelled&limit=10&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        // setOrderData(dt);
        console.log("totalListCancled===>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // === get call data === ====
  const getTotalList1 = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}orders?order_source=chat&limit=10&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        // setOrderData(dt);
        console.log("totalListChat===>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  // === get call data === ====
  const getTotalList2 = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}orders?order_source=call&limit=10&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        // setOrderData(dt);
        console.log("totalListCall===>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // === get call data === ====
  const getCallsData = async (status) => {
    const statusVal = status === "" ? "" : `&status=${status}`
    await axios
      .get(`${AppConstants.Api_BaseUrl}orders?order_source=call${statusVal}&limit=10&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        setCallsData(dt);
        // console.log("totalListecomm===>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // === get call data === ====
  const getChatssData = async (status) => {
    const statusVal = status === "" ? "" : `&status=${status}`
    await axios
      .get(`${AppConstants.Api_BaseUrl}orders?order_source=chat${statusVal}&limit=10&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        setChatsData(dt);
        // console.log("totalListecomm===>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // === get call data === ====
  const getEcommerseData = async (status) => {
    const statusVal = status === "" ? "" : `&status=${status}`
    await axios
      .get(`${AppConstants.Api_BaseUrl}orders?order_source=ecommerce${statusVal}&limit=10&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        setEcomData(dt);
        // console.log("totalListecomm===>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleHeader = () => {
    const headerVal = viewMode === 1 ? "Total E-Commerce Orders" :
      viewMode === 2 ? "Cancelled E-Commerce Orders" :
        viewMode === 3 ? "Returned E-Commerce Orders" :
          viewMode === 4 ? "Total Calls Orders" :
            viewMode === 5 ? "Cancelled Calls Orders" :
              viewMode === 6 ? "Returned Calls Orders" :
                viewMode === 7 ? "Total Chats Orders" :
                  viewMode === 8 ? "Cancelled Chats Orders" :
                    viewMode === 9 ? "Returned Chats Orders" : "";
    return headerVal
  }

  const header = handleHeader();


  return (
    <>
      <div className='card p-3'>
        <table >
          <tr className='mt-3'>
            <th></th>
            <th>Total</th>
            <th>Cancelled</th>
            <th>Returned</th>
            <th>Revenue</th>
          </tr>
          <tr>
            <td>Calls Orders</td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 1 ? "#5129fe" : "",
                color: activeCell === 1 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(1);
                setViewMOde(4);
                getCallsData("");
              }}
            >
              {orderData?.call?.total}
            </td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 2 ? "#5129fe" : "",
                color: activeCell === 2 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(2);
                setViewMOde(5);
                getCallsData("cancelled");
              }}
            >
              {orderData?.call?.cancelled}
            </td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 3 ? "#5129fe" : "",
                color: activeCell === 3 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(3);
                setViewMOde(6);
                getCallsData("returned");
              }}
            >
              {orderData?.call?.returned}
            </td>
            <td>{orderData?.call?.revenue}</td>
          </tr>
          <tr>
            <td>Chats Orders</td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 4 ? "#5129fe" : "",
                color: activeCell === 4 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(4);
                setViewMOde(7);
                getChatssData("");
              }}
            >
              {orderData?.chat?.total}
            </td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 5 ? "#5129fe" : "",
                color: activeCell === 5 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(5);
                setViewMOde(8);
                getChatssData("cancelled");
              }}
            >
              {orderData?.chat?.cancelled}
            </td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 6 ? "#5129fe" : "",
                color: activeCell === 6 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(6);
                setViewMOde(9);
                getChatssData("returned");
              }}
            >
              {orderData?.chat?.returned}
            </td>
            <td >{orderData?.chat?.revenue}</td>
          </tr>
          <tr >
            <td>Ecom Orders</td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 7 ? "#5129fe" : "",
                color: activeCell === 7 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(7);
                setViewMOde(1);
                getEcommerseData("");
              }}
            >
              {orderData?.ecommerce?.total}
            </td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 8 ? "#5129fe" : "",
                color: activeCell === 8 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(8);
                setViewMOde(2);
                getEcommerseData("cancelled");
              }}
            >
              {orderData?.ecommerce?.cancelled}
            </td>
            <td
              className='cellLine'
              style={{
                cursor: "pointer",
                padding: "1rem",
                backgroundColor: activeCell === 9 ? "#5129fe" : "",
                color: activeCell === 9 ? "snow" : ""
              }}
              onClick={() => {
                setActiveCell(9);
                setViewMOde(3);
                getEcommerseData("returned");
              }}
            >
              {orderData?.ecommerce?.returned}
            </td>
            <td>{orderData?.ecommerce?.revenue}</td>
          </tr>
        </table>
      </div>
      {viewMode === 1 || viewMode === 2 || viewMode === 3 ? (
        <div className='card my-1'>
          <div className="">
            <DataTable
              value={ecomData}
              paginator
              className="p-datatable-customers"
              header={header}
              rows={10}
              dataKey="id"
              rowHover
              filterDisplay="menu"
              // loading={loading}
              responsiveLayout="scroll"
              globalFilterFields={[
                'memberPhone',
                'astroPhone',
                'astroId.name',
                'balance',
                'callPrice',
                'status',
                'chatPrice'
              ]}
              emptyMessage="No data found"
            >
              <Column
                field="address.city.name"
                header="Location"
                sortable
              />
              <Column
                field="products"
                header="Products"
                body={(rd) => {
                  const procuctName = rd?.products?.map((item) => {
                    return item.name + "(" + item.quantity + ")"
                  })
                  return procuctName.toString()
                }}
                sortable
              />
              <Column
                field="admin_amount"
                header="Admin Amt"
                sortable
              />
              <Column
                field="total_discount"
                header="Discount"
                sortable
              />
              <Column
                field="subtotal_amount"
                header="Subtotal"
                sortable
              />
              <Column
                header="Total"
                field="total_paid"
                sortable
              />
              <Column
                field="status"
                header="Status"
                sortable
              />
            </DataTable>
          </div>
        </div>
      ) : viewMode === 4 || viewMode === 5 || viewMode === 6 ? (
        <div className='card my-1'>
          <div className="">
            <DataTable
              value={callsData}
              paginator
              className="p-datatable-customers"
              header={header}
              rows={10}
              dataKey="id"
              rowHover
              filterDisplay="menu"
              // loading={loading}
              responsiveLayout="scroll"
              globalFilterFields={[
                'admin_amount',
                'duration',
                'order_source',
                'price_per_min',
                'total_discount',
                'total_paid'
              ]}
              emptyMessage="No data found"
            >
              <Column
                field="admin_amount"
                header="Admin Amt"
                body={(rd) => rd.admin_amount.toFixed(2)}
                sortable
              />
              <Column
                field="astrologer_amount"
                header="Astrologer Amt"
                sortable
              />
              <Column
                field="duration"
                header="Duration"
                sortable
              />
              <Column
                header="price_per_min"
                field="price_per_min"
                sortable
              />
              <Column
                field="total_discount"
                header="Total Discount"
                sortable
              />
              <Column
                header="Total Paid"
                field="total_paid"
                sortable
              />
            </DataTable>
          </div>
        </div>
      ) : viewMode === 7 || viewMode === 8 || viewMode === 9 ? (
        <div className='card my-1'>
          <div className="">
            <DataTable
              value={chatsData}
              paginator
              className="p-datatable-customers"
              header={header}
              rows={10}
              dataKey="id"
              rowHover
              filterDisplay="menu"
              // loading={loading}
              responsiveLayout="scroll"
              globalFilterFields={[
                'admin_amount',
                'duration',
                'order_source',
                'total_shipping',
                'total_discount',
                'total_paid',
                'total_shipping_discount'
              ]}
              emptyMessage="No data found"
            >
              <Column
                field="admin_amount"
                header="Admin Amt"
                body={(rd) => rd.admin_amount.toFixed(2)}
                sortable
              />
              <Column
                field="astrologer_amount"
                header="Astrologer Amt"
                sortable
              />
              <Column
                field="duration"
                header="Duration"
                sortable
              />
              <Column
                field="total_discount"
                header="Total Discount"
                sortable
              />
              <Column
                header="Total Paid"
                field="total_paid"
                sortable
              />
              <Column
                header="Total Shipping"
                field="total_shipping"
                sortable
              />
              <Column
                field="total_shipping_discount"
                header="Total Shipping Discount"
                sortable
              />
            </DataTable>
          </div>
        </div>
      ) : ""
      }
    </>
  )
}

export default Students;