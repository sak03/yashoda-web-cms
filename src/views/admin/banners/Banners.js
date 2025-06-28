import React, { useState, useEffect, useRef } from 'react'
import { AppConstants, formatDate } from '../../../constants/constants';
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
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { circlesWithBar } from '../../../utils/loaders'
import { Avatar } from 'primereact/avatar';
import { setAstroViewMode } from '../../../redux/actions/astroViewModeAction';
import { useDispatch } from 'react-redux';
import './banner.css'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { CTooltip } from '@coreui/react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';

const Banners = () => {
    // const userInfo = useSelector((state) => state.AuthReduer.token.data);
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const [viewMode, setViewMode] = useState(0);
    const [editMode, setEditMode] = useState(0);
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [bannersData, setBannersData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [desktopImg, setDesktopImg] = useState(null);
    const [mobileImg, setMobileImg] = useState(null);
    const [desktopS3url, setDesktopS3url] = useState(null);
    const [mobileS3url, setMobileS3url] = useState(null);
    const [visible, setVisible] = useState(false);
    const pageList = [
        { name: "Home", code: "home" },
        { name: "Call to Astrologer", code: "call_to_astrologer" },
        { name: "Chat to Astrologer", code: "chat_to_astrologer" },
        { name: "Jyotishee Mall", code: "jyotishee_mall" },
    ]

    useEffect(() => {
        getBannersData();
        dispatch(setAstroViewMode(0));
    }, [])

    const addBannerFormik = useFormik({
        initialValues: {
            name: "",
            page: "",
            desktopImage: "",
            mobileImage: "",
        },
        validate: (data) => {
            let errors = {};

            //===== row first =======
            if (!data.name) {
                errors.name = "Please enter name.";
            }
            if (!data.page) {
                errors.page = "Please select page.";
            }

            // if (!data.bannerImg) {
            //     errors.bannerImg = "Please select banner image.";
            // }

            // console.log("formikData", errors)

            return errors;
        },
        onSubmit: (data) => {
            // console.log("formikData", data)
            // setEditMode(1)
            viewMode === 1 ? createBannersData(data) : updateBannersData(data);
        },
    });
    const isBannerFormFieldValid = (name) =>
        !!(addBannerFormik.touched[name] && addBannerFormik.errors[name]);
    const getBannerFormErrorMessage = (name) => {
        return (
            isBannerFormFieldValid(name) && (
                <small className="p-error">{addBannerFormik.errors[name]}</small>
            )
        );
    };

    const addBannerImgFormik = useFormik({
        initialValues: {
            desktopImage: "",
            mobileImage: "",
        },
        validate: (data) => {
            let errors = {};

            //===== row first =======
            // if (!data.name) {
            //     errors.name = "Please enter name.";
            // }
            // if (!data.page) {
            //     errors.page = "Please select page.";
            // }

            // if (!data.bannerImg) {
            //     errors.bannerImg = "Please select banner image.";
            // }

            // console.log("formikData", errors)

            return errors;
        },
        onSubmit: (data) => {
            // console.log("formikData", data)
            updateBannersData(data);
        },
    });
    const isBannerImgFormFieldValid = (name) =>
        !!(addBannerFormik.touched[name] && addBannerFormik.errors[name]);
    const getBannerImgFormErrorMessage = (name) => {
        return (
            isBannerImgFormFieldValid(name) && (
                <small className="p-error">{addBannerFormik.errors[name]}</small>
            )
        );
    };

    // === get banner data === ====
    const getBannersData = async () => {
        await axios
            .get(`${AppConstants.Api_BaseUrl}banner`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                setBannersData(dt);
                // console.log("banners===>", dt);
                // setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                // setLoading(false);
            })
    }

    // === get blog data === ====
    const createBannersData = async (data) => {
        setLoading(true);
        const postData = {
            name: data.name,
            desktop_image: "",
            mobile_image: "",
            page: data.page,
        }

        // console.log("postData", postData)
        await axios
            .post(`${AppConstants.Api_BaseUrl}banner`, postData,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                // console.log("blogs===>", dt);
                if (dt) {
                    setSelectedBanner(dt);
                    setEditMode(1);
                    // setLoading(false);
                } else {
                    console.log(err);
                    showSuccessMessage('error');
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                showSuccessMessage('success');
                setLoading(false);
            })
    }
    // === get blog data === ====
    const updateBannersData = async (data) => {
        setLoading(true);
        const postData = {
            name: editMode === 1 ? selectedBanner.name : data.name,
            page: editMode === 1 ? selectedBanner.page : data.page,
            desktop_image: data.desktopImage,
            mobile_image: data.mobileImage,
        }
        // console.log("updatePostData", desktopS3url, mobileS3url, postData)
        await axios
            .put(`${AppConstants.Api_BaseUrl}banner/${selectedBanner._id}`, postData,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                // console.log("blogs===>", dt);
                if (dt) {
                    getBannersData();
                    setLoading(false);
                    showSuccessMessage('success');
                    addBannerFormik.resetForm();
                    setEditMode(0);
                    setViewMode(0);
                } else {
                    console.log(err);
                    showSuccessMessage('error');
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                showSuccessMessage('success');
                setLoading(false);
            })
    }

     // === delete banner data === ====
     const deleteBanner = async () => {
        await axios
            .delete(`${AppConstants.Api_BaseUrl}banner/${selectedBanner._id}`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res;
                // console.log("deleteBannerRes", dt)
                if (!dt.data) {
                    console.log(dt.error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Oops',
                        detail: 'Something went wrong.',
                        life: 3000
                    });
                }
                if (dt.data) {
                    getBannersData();
                    toast.current.show({
                        severity: 'info',
                        summary: 'Deleted',
                        detail: 'Banner has been successfully deleted.',
                        life: 3000
                    });
                }
                // console.log("blogs===>", dt);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // ===== get image url to s3 ==== =====
    const getPreSignedUrl = async (file, flag) => {
        // console.log("desktopImg", desktopImg)
        const fileName = file?.name.split('.');
        const url = flag === 1 ?
            `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=banners/${selectedBanner._id}/${fileName[0]}&content_type=image/jpeg` :
            `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=banners/${selectedBanner._id}/${fileName[0]}&content_type=image/jpeg`;
        await axios
            .get(url,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.data;
                uploadFileToS3(file, dt, flag);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const uploadFileToS3 = async (file, urlData, flag) => {
        const url = urlData.signedUrl

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/jpeg'
                },
                body: file,
            });

            if (response.ok) {
                // setDesktopS3url(urlData.url);
                if (editMode === 1) {
                    flag === 1 ? addBannerImgFormik.setFieldValue("desktopImage", urlData.url) :
                        addBannerImgFormik.setFieldValue("mobileImage", urlData.url);
                    showFileUploadMessage('success');
                } else {
                    flag === 1 ? addBannerFormik.setFieldValue("desktopImage", urlData.url) :
                        addBannerFormik.setFieldValue("mobileImage", urlData.url);
                    showFileUploadMessage('success');
                }

            } else {
                showFileUploadMessage('error');
            }
        } catch (error) {
            showFileUploadMessage('error');
            console.error('An error occurred while uploading the file:', error);
        }
    };

    // === show success message ==== ===
    const showFileUploadMessage = (severity) => {
        toast.current.show({
            severity: severity == 'success' ? 'success' : 'error',
            summary: severity === 'success' ? "Uploaded" : "Oops",
            detail: severity === 'success' ? 'File has been successfully uploaded' : "Something went wrong.",
            life: 3000
        });
    }

    // ==== add user form === ===
    const addBannerForm = () => {
        return (
            <div className='form-demo card p-2'>
                <form onSubmit={addBannerFormik.handleSubmit}>
                    {/* <div className='form-demo card p-2'> */}
                    <div className="row mx-3 mt-2">
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="name"
                                    value={addBannerFormik.values.name}
                                    onChange={addBannerFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isBannerFormFieldValid("name"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                    disabled={editMode === 1 ? true : false}
                                />
                                <label htmlFor="name">Name<span className='text-danger'>*</span></label>
                            </span>
                            {getBannerFormErrorMessage("name")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className="p-float-label">
                                <Dropdown
                                    id="page"
                                    inputId="dropdown"
                                    options={pageList}
                                    value={addBannerFormik.values.page}
                                    onChange={addBannerFormik.handleChange}
                                    optionLabel="name"
                                    optionValue='code'
                                    className={
                                        (classNames({
                                            "p-invalid": isBannerFormFieldValid("page"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                    disabled={editMode === 1 ? true : false}
                                />
                                <label htmlFor="page">Page<span className='text-danger'>*</span></label>
                            </span>
                            {getBannerFormErrorMessage("page")}
                        </div>
                    </div>
                    {viewMode === 2 ?
                        <div className="row mx-3 mt-2">
                            <div className=" col-sm-12 col-md-12 col-lg-6 mt-4">
                                <span className='mt-3'>
                                    <FileUpload
                                        id="desktopImage"
                                        name="demo[]"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        chooseLabel="Desktop Image"
                                        customUpload
                                        uploadHandler={(e) => {
                                            const dataValue = e.files[0];
                                            getPreSignedUrl(dataValue, 1);
                                        }}
                                        emptyTemplate={<p className="m-0">{viewMode === 2 && selectedBanner?.desktop_image !== undefined ? <img width={50} src={selectedBanner.desktop_image} alt={"img"} /> : "Drag and drop files to here to upload."}</p>}
                                    />
                                </span>
                                {getBannerFormErrorMessage("desktopImage")}
                            </div>
                            <div className=" col-sm-12 col-md-12 col-lg-6 mt-4">
                                <span className='mt-3'>
                                    <FileUpload
                                        id="mobileImage"
                                        name="demo[]"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        chooseLabel="Mobile Image"
                                        customUpload
                                        uploadHandler={(e) => {
                                            const dataValue = e.files[0];
                                            getPreSignedUrl(dataValue, 2);
                                        }}
                                        emptyTemplate={<p className="m-0">{viewMode === 2 && selectedBanner?.mobile_image !== undefined ? <img width={50} src={selectedBanner.mobile_image} alt={"img"} /> : "Drag and drop files to here to upload."}</p>}
                                    />
                                </span>
                                {getBannerFormErrorMessage("mobileImage")}
                            </div>
                        </div> : ""}

                    {editMode === 1 ? "" :
                        <div className="modal-footer d-flex justify-content-end my-3 mx-4">
                            <Button
                                label={viewMode === 1 ? "Save & Add Image" : "Update"}
                                type="submit"
                                className="bg-primary border-0  p-button-md  btn-color p-button-raised"
                            // loading={loading}
                            />
                            <Button
                                onClick={() => {
                                    setViewMode(0)
                                    addBannerFormik.resetForm();
                                }}
                                label={"Cancel"}
                                style={{ marginLeft: "10px" }}
                                className="bg-danger border-0 p-button-md p-button-raised"
                            />
                        </div>}
                </form >
                {editMode === 1 ?
                    <form onSubmit={addBannerImgFormik.handleSubmit}>
                        <div className="row mx-3 mt-2">
                            <div className=" col-sm-12 col-md-12 col-lg-6 mt-4">
                                <span className='mt-3'>
                                    <FileUpload
                                        id="desktopImage"
                                        name="demo[]"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        chooseLabel="Desktop Image"
                                        customUpload
                                        uploadHandler={(e) => {
                                            const dataValue = e.files[0];
                                            getPreSignedUrl(dataValue, 1);
                                        }}
                                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload</p>}
                                    />
                                </span>
                                {getBannerFormErrorMessage("desktopImage")}
                            </div>
                            <div className=" col-sm-12 col-md-12 col-lg-6 mt-4">
                                <span className='mt-3'>
                                    <FileUpload
                                        id="mobileImage"
                                        name="demo[]"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        chooseLabel="Mobile Image"
                                        customUpload
                                        uploadHandler={(e) => {
                                            const dataValue = e.files[0];
                                            setMobileImg(dataValue);
                                            getPreSignedUrl(dataValue, 2);
                                        }}
                                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload</p>}
                                    />
                                </span>
                                {getBannerFormErrorMessage("mobileImage")}
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-end my-3 mx-4">
                            <Button
                                label="Add"
                                type="submit"
                                className="bg-primary border-0  p-button-md  btn-color p-button-raised"
                            // loading={loading}
                            />
                            {/* <Button
                                onClick={() => {
                                    setViewMode(0)
                                    addBannerImgFormik.resetForm();
                                }}
                                label={"Cancel"}
                                style={{ marginLeft: "10px" }}
                                className="bg-danger border-0 p-button-md p-button-raised"
                            /> */}
                        </div>
                    </form > :
                    ""}
            </div>
        )
    }

    // ====  render header UI ==== =====
    const renderHeader = () => {
        return (
            // <div className='row'>
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
                                // alert("Add user is under maintenance !!")
                            }}
                        />
                    </span>
                </div>
                {/* </div> */}
            </div >
        )
    }
    const header = renderHeader();

    // === show success message ==== ===
    const showSuccessMessage = (severity) => {
        toast.current.show({
            severity: severity == 'success' ? 'success' : 'error',
            summary: severity === 'success' && viewMode === 1 ? "Created" : 'success' && viewMode === 2 ? "Updated" : "Oops",
            detail: severity === 'success' && viewMode === 1 ?
                'Banner has been successfully created' :
                'success' && viewMode === 2 ? "Banner has been successfully updated" :
                    "Something went wrong",
            life: 3000
        });
    }

    const actionHandel = () => {
        return (
            <div className='d-flex'>
                <CTooltip content='Edit' position='left'>
                    <span
                        className='text-primary mx-2'
                        onClick={() => {
                            setViewMode(2);
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
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        <FaTrashAlt />
                    </span>
                </CTooltip>
            </div>
        )
    };

    const accept = () => {
        deleteBanner();
        // console.log("accepted");
    }

    const reject = () => {
        toast.current.show({
            severity: 'warn',
            summary: 'Rejected',
            detail: 'Banner not deleted.',
            life: 3000
        });
    }

    // === ===  rowClickHandelar === ===
    const rowClickHandelar = (rd) => {
        const dt = rd.data;
        // console.log("rowData", dt);
        setSelectedBanner(dt);
        // setViewMode(2);
        addBannerFormik.setFieldValue("name", dt.name);
        addBannerFormik.setFieldValue("page", dt?.page);
        addBannerFormik.setFieldValue("desktopImage", dt?.desktop_image);
        addBannerFormik.setFieldValue("mobileImage", dt?.mobile_image);
    }

    const pageValue = (rd) => {
        if (rd.page === "home") {
            return "Home"
        } else if (rd.page === "call_to_astrologer") {
            return "Call to Astrologer"
        } else if (rd.page === "chat_to_astrologer") {
            return "Chat to Astrologer"
        } else if (rd.page === "jyotishee_mall") {
            return "Jyotishee Mall"
        }
    }


    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                message="Do you really want to delete this banner?"
                header="Delete Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={() => {
                    // deleteProductDesignsData();
                    accept();
                }}
                reject={reject}
            />
            {viewMode === 1 || viewMode === 2 ? addBannerForm() :
                <div className="datatable-doc-demo">
                    <div className="">
                        {loading === true ? circlesWithBar() :
                            <DataTable
                                value={bannersData}
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
                                    'image',
                                    'is_active',
                                    'createdAt',
                                ]}
                                emptyMessage="No banners found"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            >
                                <Column
                                    field="name"
                                    header="Name"
                                    sortable
                                    // body={(rd) => `${rd.firstname} ${rd.lastname}`}
                                    style={{ cursor: "pointer" }}
                                />
                                <Column
                                    header="Page"
                                    field="page"
                                    body={pageValue}
                                    sortable
                                    style={{ cursor: "pointer" }}
                                />
                                <Column
                                    // field="image"
                                    header="Desktop Image"
                                    body={(rowData) => {
                                        return rowData.desktop_image !== undefined ?
                                            <Avatar image={rowData?.desktop_image} size="large" shape="circle" /> :
                                            // <img width={30} src={rowData?.mobile_image} alt={"banner"} /> :
                                            <Avatar label={rowData.name.charAt(0)} className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />;
                                    }}
                                    // sortable
                                    style={{ cursor: "pointer" }}
                                />
                                <Column
                                    // field="image"
                                    header="Mobile Image"
                                    body={(rowData) => {
                                        return rowData.mobile_image !== undefined ?
                                            <Avatar image={rowData?.mobile_image} size="large" shape="circle" /> :
                                            // <img width={30} src={rowData?.mobile_image} alt={"banner"} /> :
                                            <Avatar label={rowData.name.charAt(0)} className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />;
                                    }}
                                    // sortable
                                    style={{ cursor: "pointer" }}
                                />
                                <Column
                                    header="Status"
                                    field="is_active"
                                    body={(rd) => {
                                        return (
                                            <span className={rd.is_active === true ? "text-success" : "text-danger"}>{rd.is_active === true ? "Active" : "Inactive"}</span>
                                        )
                                    }}
                                    sortable
                                    style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field="createdAt"
                                    header="Created Date"
                                    body={(rd) => formatDate(new Date(rd.createdAt))}
                                    sortable
                                    style={{ cursor: "pointer" }}
                                />
                                <Column
                                    header="Actions"
                                    body={actionHandel}
                                />
                            </DataTable>}
                    </div>
                </div>}
        </>
    )
}

export default Banners