import React, { useState, useEffect } from 'react'
import {
    FaWallet,
    FaMobileAlt,
    FaComments,
    FaShoppingCart,
    FaDollarSign,
    FaCommentDollar,
    FaFileInvoiceDollar,
    FaCommentsDollar,
    FaPhoneVolume,
    FaCommentDots,
    FaSearchDollar,
    FaExchangeAlt,
} from "react-icons/fa";
import { AppConstants } from '../../../constants/constants';
import { useSelector } from "react-redux";
import "./dashboard.css";
import Chart from 'react-apexcharts'
import axios from "axios";
import { Button } from 'primereact/button';
import { setEditMOde } from '../../../redux/actions/editModeAction';
import { useDispatch } from 'react-redux';
import {setAstroViewMode} from '../../../redux/actions/astroViewModeAction'

const Dashboard = () => {
    const userInfo = useSelector((state) => state.userLoginInfo);
    const userMode = useSelector((state) => state.userInfo.userModeValue);
    const dispatch = useDispatch();
    const [earningData, setEarningData] = useState(null);
    const [todayButton, setTodayButton] = useState(1);
    const [monthButton, setMonthButton] = useState(0);
    const [yearButton, setYearButton] = useState(0);
    const [hsurvey, sethsurvey] = useState({
        series: [
            {
                name: "Joind",
                data: [31, 40, 38, 41, 36, 50],
            },
            {
                name: "Pending",
                data: [21, 32, 45, 32, 34, 41],
            },
        ],

        options: {
            colors: ["#247BA0", "#878080"],
            chart: {
                height: 350,
                type: "area",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            xaxis: {
                type: "string",
                categories: [
                    "10 oct",
                    "12 oct",
                    "18 oct",
                    "24 oct",
                    "26 oct",
                    "28 oct",
                ],
                labels: {
                    style: {
                        color: ["#555"],
                    },
                },
            },
            title: {
                text: "Monthly Progress",
                align: "left",
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: "17px",
                    fontWeight: "bold",
                    fontFamily: "Roboto, sans-serif",
                    color: "#5b626b",
                },
            },
            legend: {
                show: true,
                position: "top",
                horizontalAlign: "center",
            },
            tooltip: {
                x: {
                    format: "dd/MM/yy HH:mm",
                },
            },
        },
    });
    const [applicant, setapplicant] = useState({
        series: [
            {
                name: "Normal Users",
                data: [44, 55, 41, 67, 22, 43],
            },
            {
                name: "Prime Users",
                data: [13, 23, 20, 8, 13, 27],
            },
            {
                name: "Subscribed Users",
                data: [11, 17, 15, 15, 21, 14],
            },
            {
                name: "Senior Citizens",
                data: [21, 7, 25, 13, 22, 8],
            },
        ],
        options: {
            colors: ["#33c6bb", "#5f6b6d", "#fd817e", "#f4d33f"],
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                    show: true,
                },
                zoom: {
                    enabled: true,
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom",
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 10,
                },
            },
            xaxis: {
                type: "datetime",
                categories: [
                    "01/01/2011 GMT",
                    "01/02/2011 GMT",
                    "01/03/2011 GMT",
                    "01/04/2011 GMT",
                    "01/05/2011 GMT",
                    "01/06/2011 GMT",
                ],
            },
            title: {
                text: "Monthly Summary",
                align: "left",
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: "17px",
                    fontWeight: "bold",
                    fontFamily: "Roboto, sans-serif",
                    color: "#5b626b",
                },
            },
            legend: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    s̶t̶a̶r̶t̶i̶n̶g̶S̶h̶a̶p̶e̶: "flat",
                    e̶n̶d̶i̶n̶g̶S̶h̶a̶p̶e̶: "flat",
                    borderRadius: 0,
                    columnWidth: "35%",
                },
            },
        },
    });

    useEffect(() => {
        // getEarningData();
        dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
        dispatch(setAstroViewMode(0));
    }, [])

    // === get report data === ====
    const getEarningData = async () => {
        let newDate = new Date()
        // let date = newDate.getDate();
        let stDate = monthButton == 1 || yearButton == 1 ? 1 : newDate.getDate();
        let endDate = todayButton == 1 ? newDate.getDate() :  30;
        let month = newDate.getMonth();
        let year = newDate.getFullYear();
        const finalDate = `${year}/${month}/${stDate}&endto=${year}/${month}/${endDate}`;
        // console.log("date==>", finalDate)
        await axios
            .get(`${AppConstants.Api_BaseUrl}admin/earning/all?startingfrom=${finalDate}`,
                {
                    headers: {
                        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhlY2Y1OWMwZTVmNjJiM2ZkMWI4ZiIsImlhdCI6MTY2OTkxNzk0MX0.hWr6QfcSlsTWPOoEY4nLbFDmeGKLACewjacRMxuyQtE",
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.data;
                setEarningData(dt);
                // console.log("responce===>", dt)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const renderHeader = () => {
        return (
            <div>
                <h4>
                    New Astrologers
                </h4>
            </div>
        )
    }

    const header1 = renderHeader();

    return (
        <div >
            <div className="row">
                {/* <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12"></div> */}
                <div class="col-12" id="ecommerceChartView">
                    <div class="">
                        <div
                            class="card-header card-header-transparent py-2 my-2"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignitems: "center",
                            }}
                        >
                            <div class="btn-group dropdown">
                                <h3 class="page-title fs-5 font-weight-100 mx-2">
                                    Dashboard Overview
                                </h3>
                            </div>
                            <span className="p-buttonset">
                                <Button
                                    label="Today"
                                    className={todayButton === 1 ? 'p-button-raised p-button-primary' : 'p-button-outlined p-button-primary'}
                                    onClick={() => {
                                        setTodayButton(1);
                                        setMonthButton(0)
                                        setYearButton(0);
                                        getEarningData();
                                    }}
                                />
                                <Button
                                    label="Month"
                                    className={monthButton === 1 ? 'p-button-raised p-button-primary' : 'p-button-outlined p-button-primary'}
                                    onClick={() => {
                                        setTodayButton(0);
                                        setMonthButton(1)
                                        setYearButton(0);
                                        getEarningData();
                                    }}
                                />
                                <Button
                                    label="Year"
                                    className={yearButton === 1 ? 'p-button-raised p-button-primary' : 'p-button-outlined p-button-primary'}
                                    onClick={() => {
                                        setTodayButton(0);
                                        setMonthButton(0)
                                        setYearButton(1);
                                        getEarningData();
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                </div>

            </div>


            {/* pre code */}
            <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-purple" style={{ backgroundColor: "rgb(255 5 248)" }}>
                                <FaMobileAlt
                                    size={20}
                                    className="card-icon2"
                                    id="icon-design"
                                />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h5 className="float-end">
                                        Total Calls
                                    </h5>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.total_chat}
                                    </strong> </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-orange" style={{ backgroundColor: "blue" }}>
                                <FaComments size={20} className="card-icon2" id="icon-design" />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h5 className="float-end">
                                        Total Chats
                                    </h5>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.total_chat}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-green" style={{ backgroundColor: "green" }}>
                                <FaShoppingCart size={20} className="card-icon3" id="icon-design" />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h5 className="float-end">
                                        Total Orders
                                    </h5>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.total_ecommerce_order}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-blue" style={{ backgroundColor: "#005d80" }}>
                                <FaWallet
                                    size={20}
                                    className="card-icon4"
                                    id="icon-design"
                                />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h5 className="float-end">
                                        Balance Used
                                    </h5>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"><strong>
                                        {earningData?.total_wallat_balance_use}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-purple" style={{ backgroundColor: "rgb(255 5 248)" }}>
                                <FaCommentsDollar
                                    size={20}
                                    className="card-icon2"
                                    id="icon-design"
                                />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Earning By Calls
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.total_earn_on_call}
                                    </strong> </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-orange" style={{ backgroundColor: "blue" }}>
                                <FaCommentDollar size={20} className="card-icon2" id="icon-design" />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Earning By Chats
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.total_earn_on_chat}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-green" style={{ backgroundColor: "green" }}>
                                <FaFileInvoiceDollar size={20} className="card-icon3" id="icon-design" />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Earning By Orders
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.total_earning_by_ecommerce}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-blue" style={{ backgroundColor: "#005d80" }}>
                                <FaDollarSign
                                    size={20}
                                    className="card-icon4"
                                    id="icon-design"
                                />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Total Earning
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"><strong>
                                        {earningData?.remaing_balance}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-purple" style={{ backgroundColor: "rgb(255 5 248)" }}>
                                <FaPhoneVolume
                                    size={20}
                                    className="card-icon2"
                                    id="icon-design"
                                />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Calls Commision
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.call_adminCommision}
                                    </strong> </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-orange" style={{ backgroundColor: "blue" }}>
                                <FaCommentDots size={20} className="card-icon2" id="icon-design" />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Chats Commision
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.chat_adminCommision}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-green" style={{ backgroundColor: "green" }}>
                                <FaSearchDollar size={20} className="card-icon3" id="icon-design" />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Total Commision
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"> <strong>
                                        {earningData?.total_ecommerce_order}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 multi-card parent-class">
                    <div className="chartcard card-statistic-2">
                        <div className="clearfix">
                            <div className="card-icon shadow-primary bg-blue" style={{ backgroundColor: "#005d80" }}>
                                <FaExchangeAlt
                                    size={20}
                                    className="card-icon4"
                                    id="icon-design"
                                />
                            </div>
                            <div className="card-right">
                                <div>
                                    <h6 className="float-end">
                                        Total Transaction
                                    </h6>
                                </div>
                                <div className="m-r-10 m-l-10">
                                    <h4 className="float-end mb-0"><strong>
                                        {earningData?.total_pay_transction}
                                    </strong></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ............... Performance................... */}
            <div className="row px-1">
                <div className="col-sm-12 col-md-12 col-lg-6 card bg-white">
                    <span className="mx-1">
                        <Chart
                            options={hsurvey.options}
                            series={hsurvey.series}
                            type="area"
                            height={350}
                        />
                    </span>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6  card bg-white ">
                    <span className="mx-1">
                        <Chart
                            options={applicant.options}
                            series={applicant.series}
                            type="bar"
                            height={350}
                        />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Dashboard