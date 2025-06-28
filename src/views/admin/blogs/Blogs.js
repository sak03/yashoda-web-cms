import React, { useState, useEffect, useRef } from 'react'
import { AppConstants, formatDate } from '../../../constants/constants';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useSelector } from "react-redux";
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { circlesWithBar } from '../../../utils/loaders'
import { Avatar } from 'primereact/avatar';
import { setAstroViewMode } from '../../../redux/actions/astroViewModeAction'
import { useDispatch } from 'react-redux';
import { CTooltip } from '@coreui/react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
// import { Editor } from 'primereact/editor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


const Blogs = () => {
    // const userInfo = useSelector((state) => state.AuthReduer.token.data);
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const [viewMode, setViewMode] = useState(0);
    const [blogsData, setBlogsData] = useState(null);
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [thumbNailImg, setThumbNailImg] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        getBlogData();
        dispatch(setAstroViewMode(0));
    }, [])

    const addBlogFormik = useFormik({
        initialValues: {
            title: "",
            category: "",
            description: '',
            bannerImg: "",
        },
        validate: (data) => {
            let errors = {};

            //===== row first =======
            if (!data.title) {
                errors.title = "Please enter title.";
            }
            if (!data.category) {
                errors.category = "Please enter category.";
            }

            // if (!data.bannerImg) {
            //     errors.bannerImg = "Please select banner image.";
            // }

            if (!data.description) {
                errors.description = "Please enter description.";
            }


            return errors;
        },
        onSubmit: (data) => {
            // console.log("formikData", data);
            viewMode === 1 ? createBlogData(data) : updateBlogData(data, "");
        },
    });
    const isBlogFormFieldValid = (name) =>
        !!(addBlogFormik.touched[name] && addBlogFormik.errors[name]);
    const getBlogFormErrorMessage = (name) => {
        return (
            isBlogFormFieldValid(name) && (
                <small className="p-error">{addBlogFormik.errors[name]}</small>
            )
        );
    };

    // === get blog data === ====
    const getBlogData = async () => {
        setLoading(true);
        await axios
            .get(`${AppConstants.Api_BaseUrl}blog`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.reverse();
                setBlogsData(dt);
                // console.log("blogs===>", dt);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    // === get blog data === ====
    const createBlogData = async (data) => {
        setLoading(true);
        const postData = {
            title: data.title,
            category: data.category,
            description: data.description,
            thumbnail: ''

        }
        // console.log("postData", postData)
        await axios
            .post(`${AppConstants.Api_BaseUrl}blog`, postData,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.data;
                // console.log("resBlogs===>", dt);
                setSelectedBlog(dt);
                getPreSignedUrl(dt, thumbNailImg);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                showSuccessMessage('error');
                setLoading(false);
            })
    }

    // === get blog data === ====
    const updateBlogData = async (data, img) => {
        setLoading(true);
        const postData = {
            title: data.title,
            category: data.category,
            description: data.description,
            thumbnail: viewMode === 1 ? img : data.bannerImg
        }
        const id = viewMode === 1 ? data._id : selectedBlog._id
        // console.log("UpdatePostData",data, postData)

        await axios
            .put(`${AppConstants.Api_BaseUrl}blog/${id}`, postData,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                getBlogData();
                // console.log("blogs===>", dt);
                setLoading(false);
                addBlogFormik.resetForm();
                showSuccessMessage('success');
                setViewMode(0);
                setSelectedBlog(null);
            })
            .catch((err) => {
                console.log(err);
                showSuccessMessage('error');
                setLoading(false);
            })
    }

    // === delete blog data === ====
    const deleteBlogData = async () => {

        await axios
            .delete(`${AppConstants.Api_BaseUrl}blog/${selectedBlog._id}`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                // console.log("deleteBlogRes", dt)
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
                    getBlogData();
                    toast.current.show({
                        severity: 'info',
                        summary: 'Deleted',
                        detail: 'Blog has been successfully deleted.',
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
    const getPreSignedUrl = async (data, file) => {

        const id = viewMode === 1 ? data._id : selectedBlog._id
        await axios
            .get(`${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${id}&content_type=image/jpeg`,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.data;
                // console.log("signedUrl", dt)
                uploadFileToS3(dt, file, data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const uploadFileToS3 = async (urlData, fileVal, data) => {
        const url = urlData.signedUrl

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/jpeg'
                },
                body: fileVal,
            });

            if (response.ok) {
                viewMode === 2 ? addBlogFormik.setFieldValue("bannerImg", urlData.url) : ""
                viewMode === 1 ? updateBlogData(data, urlData.url) : "";
                showFileUploadMessage('success');
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
    const addBlogForm = () => {
        return (
            <form onSubmit={addBlogFormik.handleSubmit}>
                <div className='form-demo card p-2'>
                    <div className="row mx-3 mt-2">
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="title"
                                    value={addBlogFormik.values.title}
                                    onChange={addBlogFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isBlogFormFieldValid("title"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="title">Title<span className='text-danger'>*</span></label>
                            </span>
                            {getBlogFormErrorMessage("title")}
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className="p-float-label">
                                <InputText
                                    id="category"
                                    value={addBlogFormik.values.category}
                                    onChange={addBlogFormik.handleChange}
                                    className={
                                        (classNames({
                                            "p-invalid": isBlogFormFieldValid("category"),
                                        }),
                                            "p-inputtext-sm w-100 borderClass")
                                    }
                                />
                                <label htmlFor="category">Category<span className='text-danger'>*</span></label>
                            </span>
                            {getBlogFormErrorMessage("category")}
                        </div>
                        <div className="row mt-2">
                            <div className=" col-sm-12 col-md-12 col-lg-12 mt-4">
                                <span className='mt-3'>
                                    <FileUpload
                                        id="bannerImg"
                                        name="demo[]"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        chooseLabel="Select Images"
                                        customUpload
                                        uploadHandler={(e) => {
                                            const dataValue = e.files[0];
                                            viewMode === 1 ? setThumbNailImg(dataValue) : "";
                                            viewMode === 1 ?
                                                toast.current.show({
                                                    severity: 'success',
                                                    summary: "Selected",
                                                    detail: 'File has been successfully selected',
                                                    life: 3000
                                                }) : "";
                                            // console.log("fileVal", dataValue);
                                            viewMode === 2 ? getPreSignedUrl("", dataValue) : "";
                                        }}
                                        emptyTemplate={<p className="m-0">{viewMode === 2 && selectedBlog?.thumbnail !== undefined ? <img width={50} src={selectedBlog.thumbnail} alt={"img"} /> : "Drag and drop files to here to upload."}</p>}
                                    />
                                </span>
                                {getBlogFormErrorMessage("bannerImg")}
                            </div>
                        </div>
                    </div>
                    <div className="row mx-3 mt-2">
                        <div className=" col-sm-12 col-md-12 col-lg-12 mt-4">
                            <span className="p-float-label">
                                <CKEditor
                                    id="description"
                                    name='description'
                                    editor={ClassicEditor}
                                    data={viewMode === 2 ? selectedBlog.description : "<p>Write description</p>"}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        addBlogFormik.setFieldValue("description", data);
                                        addBlogFormik.handleChange(data)
                                        // console.log(data);
                                    }}
                                />
                            </span>
                            {getBlogFormErrorMessage("description")}
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
                                addBlogFormik.resetForm();
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
                'Blog has been successfully created' :
                'success' && viewMode === 2 ? "Blog has been successfully updated" :
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
        deleteBlogData();
        // console.log("accepted");
    }

    const reject = () => {
        toast.current.show({
            severity: 'warn',
            summary: 'Rejected',
            detail: 'Blog not deleted.',
            life: 3000
        });
    }

    // === ===  rowClickHandelar === ===
    const rowClickHandelar = (rd) => {
        const dt = rd.data;
        // console.log("rowData", dt);
        setSelectedBlog(dt);
        addBlogFormik.setFieldValue("title", dt.title);
        addBlogFormik.setFieldValue("category", dt.category);
        addBlogFormik.setFieldValue("description", dt.description);
        addBlogFormik.setFieldValue("bannerImg", dt.thumbnail);
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                message="Do you really want to delete this blog?"
                header="Delete Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={() => {
                    // deleteProductDesignsData();
                    accept();
                }}
                reject={reject}
            />
            {viewMode === 1 || viewMode === 2 ? addBlogForm() :
                <div className="datatable-doc-demo">
                    <div className="">
                        {loading === true ? circlesWithBar() :
                            <DataTable
                                value={blogsData}
                                paginator
                                className="p-datatable-customers"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                header={header}
                                rows={10}
                                rowsPerPageOptions={[10, 25, 50]}
                                dataKey="id"
                                rowHover
                                filterDisplay="menu"
                                responsiveLayout="scroll"
                                onRowClick={rowClickHandelar}
                                globalFilterFields={[
                                    'title',
                                    'category',
                                    'thumbnail',
                                    'created_at'
                                ]}
                                emptyMessage="No blogs found"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            >
                                <Column
                                    field="role"
                                    header="Image"
                                    body={(rowData) => {
                                        return rowData.thumbnail !== undefined || rowData.thumbnail !== null ?
                                            <Avatar image={rowData?.thumbnail} size="large" shape="circle" /> :
                                            <Avatar label={rowData?.title.charAt(0)} className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />;
                                    }}
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field="title"
                                    header="Title"
                                    body={(rd) => {
                                        return (
                                            <span>{rd.title.length > 20 ? `${rd.title.slice(0, 20)} ...` : rd.title}</span>
                                        )
                                    }}
                                    sortable
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field="category"
                                    header="Catagory"
                                    sortable
                                // style={{ cursor: "pointer" }}
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
                                // style={{ cursor: "pointer" }}
                                />
                                <Column
                                    field="created_at"
                                    header="Created Date"
                                    body={(rd) => formatDate(new Date(rd.created_at))}
                                    sortable
                                // style={{ cursor: "pointer" }}
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

export default Blogs