import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppConstants, formatDate } from '../../../constants/constants';
import { InputText } from 'primereact/inputtext';
import axios from "axios";
import io from 'socket.io-client';


const Socket = (data) => {
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const [messageData, setMessageData] = useState([]);
    const selectedRowData = data.selectedRowData;
    const [inputTextMsg, setInputTextMsg] = useState();

    const socket = io.connect('http://api.jyotishee.com:3000', {
        extraHeaders: { Authorization: `Bearer ${userInfo.token}` }
    });


    // console.log("selectedRowData", messageData);
    useEffect(() => {
        getChatData(selectedRowData && selectedRowData?._id);
    }, [selectedRowData])

    useEffect(() => {

        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
            // handleSendMessage(sockets)
        });

        // Listen for incoming messages from the server
        socket.on('chatSupportMessage', (message) => {
            // console.log("chat support msg:", message);
            setMessageData((prevData) => [...prevData, message])
        });
        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };

    }, [selectedRowData]);

    // ======= get chat data =====
    const getChatData = async (ticketId) => {
        // setLoading(true);
        await axios
            .get(`${AppConstants.Api_BaseUrl}chat-support/${ticketId}`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data?.data?.reverse();
                // console.log("chatData", dt)
                setMessageData(dt);
            })
            .catch((err) => {
                console.log(err);
                // setLoading(false);
            })
    }

    const statusHandler = (status) => {
        return (
            <span >
                {status == "closed" ?
                    <span className='text-danger'>Closed</span> :
                    status === "Open" || status === "open" ? <span className='text-success'>Open</span> : status}
            </span>
        )
    }

    const handleSendMessage = () => {
        if (inputTextMsg.trim() !== '') {
            // console.log(messageData);
            const postaData = {
                ticket_id: selectedRowData?._id,   // '64c600d88a021b0f2a0af42e', // ticketId
                recipient_id: selectedRowData?.user?.id, // '64579ac9a84f2ba639379278', //ticket.user.id
                message: inputTextMsg
            }

            socket.emit('chatSupportMessage', postaData);
            // getChatData(selectedRowData && selectedRowData?._id);
            const newMsg = {
                created_at: new Date(),
                message: inputTextMsg,
                sender_id: userInfo._id
            }
            setMessageData((prevData) => [...prevData, newMsg])
            // console.log("inputTextMsg", inputTextMsg);

            setInputTextMsg('');
        }
    };

    return (
        <>
            <div className='card p-3' style={{ height: "12vh" }}>
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
                    {messageData !== undefined || messageData !== null ?
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
                <form onSubmit={handleSendMessage}>
                    <span className="p-input-icon-right w-100">
                        <i className="pi pi-send text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                handleSendMessage();
                            }}
                        />
                        <InputText
                            id="textMsg"
                            name='textMsg'
                            value={inputTextMsg}
                            onChange={(e) => {
                                setInputTextMsg(e.target.value);
                                // console.log("textValue", e.target.value)
                            }}
                            // onKeyDown={handleSendMessage}
                            placeholder='Write your message'
                            disabled={selectedRowData === null ? true : false}
                        />
                    </span>
                </form>
            </div>
        </>
    )
}

export default Socket