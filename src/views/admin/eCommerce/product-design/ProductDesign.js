import React, { useState, useEffect, useRef } from 'react'
import { AppConstants } from '../../../../constants/constants';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Dropdown } from 'primereact/dropdown';
// import { FileUpload } from 'primereact/fileupload';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { useSelector } from "react-redux";
import { InputNumber } from 'primereact/inputnumber';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { CTooltip } from '@coreui/react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import '../eCommerce.css'
import { productCatagory, productSubCatagory, materialList } from '../../../../utils/dropDownData'
// import {getImageS3} from '../../../../utils/imageUpload'

const ProductDesign = () => {
  // const userInfo = useSelector((state) => state.AuthReduer.token.data);
  const userInfo = JSON.parse(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(0);
  const [designData, setDesignData] = useState(null);
  const [productList, setProductList] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [visible, setVisible] = useState(false);
  const [filterDesignData, setFilterDesignData] = useState(null);
  const toast = useRef(null);

  const addOnList = [
    { name: "Pendent", code: "pendent" },
    { name: "Ring", code: "ring" },
  ];

  useEffect(() => {
    getProductDesignsData();
    getProductList();
  }, [])

  // ===  add product formik == == 
  const addDesignFormik = useFormik({
    initialValues: {
      productName: "",
      addOn: "",
      productDesign: "",
      material: "",
      price: "",
      productImg: "",
    },
    validate: (data) => {
      let errors = {};

      // ===== row first =======
      if (!data.productName) {
        errors.productName = "Please enter product name.";
      }
      if (!data.productDesign) {
        errors.productDesign = "Please select product design";
      }
      if (!data.addOn) {
        errors.addOn = "Please select add on";
      }
      if (!data.material) {
        errors.material = "Please select material";
      }
      if (!data.price) {
        errors.price = "Please enter price.";
      }

      // if (viewMode !== 1) {
      //   if (!data.productImg) {
      //     errors.productImg = "Please select product image";
      //   }
      // }

      // console.log("formikTesting");

      return errors;
    },
    onSubmit: (data) => {
      // console.log("formikData", data);
      viewMode === 1 ? addProductDesignsData(data) : updateProductDesignsData(data, "");
      // viewMode === 1 ? alert("Can't add product design. Try after sometime."): alert("Can't update product design. Try after sometime.")
    },
  });
  const isDesignFormFieldValid = (name) =>
    !!(addDesignFormik.touched[name] && addDesignFormik.errors[name]);
  const getDesignFormErrorMessage = (name) => {
    return (
      isDesignFormFieldValid(name) && (
        <small className="p-error">{addDesignFormik.errors[name]}</small>
      )
    );
  };

  // === get product data === ====
  const getProductList = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}products?limit=50&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data.data;
        const ndt = dt.map((item) => {
          return { name: item.product_name, code: item._id }
        })
        setProductList(ndt);
        // console.log("productData==>", dt);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // === get product designs data === ====
  const getFilterProductDesignsData = async (id) => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}product-design/list?limit=50&skip=0&product_id=${id}`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res?.data?.data?.reverse();
        setFilterDesignData(dt);
        // console.log("filterProductData==>", res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }


  // === get product designs data === ====
  const getProductDesignsData = async () => {
    await axios
      .get(`${AppConstants.Api_BaseUrl}product-design/list?limit=50&skip=0`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res?.data?.data?.reverse();
        setDesignData(dt);
        // console.log("productData==>", dt);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  // === add product designs data === ====
  const addProductDesignsData = async (data) => {

    const postData = {
      name: data.productDesign,
      image: "",
      metal: data.material,
      price: data.price,
      add_on: data.addOn,
      product_id: data.productName,
    }

    // console.log("postData", postData)
    await axios
      .post(`${AppConstants.Api_BaseUrl}product-design`, postData,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        if (dt.error) {
          console.log(dt.error);
          showAddMessage('error');
        }
        if (dt.data) {
          getPreSignedUrl(selectedImage, dt.data);
          // console.log("designRes==>", dt.data);
          // showAddMessage('success');
          // getProductDesignsData();
          // setViewMode(0);
          // addDesignFormik.resetForm();
          // updateProductDesignsData(data);
        }
        // console.log("designRes==>", dt);
      })
      .catch((err) => {
        console.log(err);
        showAddMessage('error');
        // setViewMode(0);
      })
  }

  // === add product designs data === ====
  const updateProductDesignsData = async (data, img) => {

    const postData = {
      name: viewMode === 1 ? data.name : data.productDesign,
      image: viewMode === 1 ? img : data.productImg,
      metal: viewMode === 1 ? data.metal : data.material,
      price: viewMode === 1 ? data.price : data.price,
      add_on: viewMode === 1 ? data.add_on : data.addOn,
      product_id: viewMode === 1 ? data.product_id : data.productName,
    }

    const id = viewMode === 1 ? data._id : selectedRowData._id

    // console.log("postData", id, postData)

    await axios
      .put(`${AppConstants.Api_BaseUrl}product-design/${id}`, postData,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        if (dt.error) {
          console.log(dt.error);
          showUpdateMessage('error');
        }
        if (dt.data) {
          viewMode === 1 ? showAddMessage('success') : showUpdateMessage('success');
          getProductDesignsData();
          addDesignFormik.resetForm();
          setViewMode(0);
        }
      })
      .catch((err) => {
        console.log(err);
        showUpdateMessage('error');
      })
  }

  // === add product designs data === ====
  const deleteProductDesignsData = async () => {

    await axios
      .delete(`${AppConstants.Api_BaseUrl}product-design/${selectedRowData._id}`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        // console.log("deleted", dt);
        if (dt.error) {
          console.log(dt.error);
          toast.current.show({
            severity: 'error',
            summary: 'Oops',
            detail: 'Something went wrong.',
            life: 3000
          });
        }
        if (dt.data) {
          getProductDesignsData();
          toast.current.show({
            severity: 'info',
            summary: 'Deleted',
            detail: 'Design has been successfully deleted.',
            life: 3000
          });
        }
      })
      .catch((err) => {
        console.log(err);
        showUpdateMessage('error');
      })
  }

  // ===== get image url to s3 ==== =====
  const getPreSignedUrl = async (data, formData) => {
    const id = viewMode === 1 ? formData._id : selectedRowData._id
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
        uploadFileToS3(dt, data, formData);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const uploadFileToS3 = async (urlData, fileVal, formData) => {
    const url = urlData.signedUrl
    // console.log("selectedFile", fileVal);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg'
        },
        body: fileVal,
      });
      // console.log('fileUploadRes', response);

      if (response.ok) {
        viewMode === 1 ? "" : addDesignFormik.setFieldValue("productImg", urlData.url);
        showFileUploadMessage('success');
        viewMode === 1 ? updateProductDesignsData(formData, urlData.url) : "";
        // console.log('File uploaded successfully!');
      } else {
        showFileUploadMessage('error');
        // console.error('File upload failed:', response.statusText);
      }
    } catch (error) {
      showFileUploadMessage('error');
      // console.error('An error occurred while uploading the file:', error);
    }
  };

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
              }}
            />
          </span>
        </div>
        {/* </div> */}
      </div >
    )
  }
  const header = renderHeader();

  // ==== add product form === ===
  const addDesignForm = () => {
    return (
      <form onSubmit={addDesignFormik.handleSubmit}>
        <div className='form-demo card p-2'>
          <div className="d-flex justify-content-between my-2 mx-4">
            <p className="text-primary">
              <CTooltip content='Back' position='left'>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setViewMode(0);
                    addDesignFormik.resetForm();
                    setFilterDesignData(null);
                  }}
                >
                  <i className="pi pi-arrow-left mr-2"></i>
                </span>
              </CTooltip>
            </p>
          </div>
          <div className="row mx-3 mt-2">
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="productName"
                  inputId="dropdown"
                  options={productList}
                  value={addDesignFormik.values.productName}
                  onChange={(e) => {
                    // console.log("productId", e.value);
                    getFilterProductDesignsData(e.value)
                    addDesignFormik.handleChange(e);
                  }}
                  optionLabel="name"
                  optionValue='code'
                  className={
                    (classNames({
                      "p-invalid": isDesignFormFieldValid("productName"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="productName">Product<span className='text-danger'>*</span></label>
              </span>
              {getDesignFormErrorMessage("productName")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-8 d-flex">
              {filterDesignData && filterDesignData?.map((item) => (
                <div className='border rounded p-1 mx-1'>
                  <div className='my-1'>{item.name}</div>
                  <img width={30} src={item.image} alt='' />
                </div>
              ))}
            </div>
          </div>
          <div className="row mx-3 mt-2">
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="addOn"
                  inputId="dropdown"
                  options={addOnList}
                  value={addDesignFormik.values.addOn}
                  onChange={addDesignFormik.handleChange}
                  optionLabel="name"
                  optionValue='code'
                  className={
                    (classNames({
                      "p-invalid": isDesignFormFieldValid("addOn"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="addOn">Add On<span className='text-danger'>*</span></label>
              </span>
              {getDesignFormErrorMessage("addOn")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="productDesign"
                  value={addDesignFormik.values.productDesign}
                  onChange={addDesignFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isDesignFormFieldValid("productDesign"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="productDesign">Design Name<span className='text-danger'>*</span></label>
              </span>
              {getDesignFormErrorMessage("productDesign")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="material"
                  inputId="dropdown"
                  options={materialList}
                  value={addDesignFormik.values.material}
                  onChange={addDesignFormik.handleChange}
                  optionLabel="name"
                  optionValue='code'
                  className={
                    (classNames({
                      "p-invalid": isDesignFormFieldValid("material"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="material">Material<span className='text-danger'>*</span></label>
              </span>
              {getDesignFormErrorMessage("material")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputNumber
                  id="price"
                  value={addDesignFormik.values.price}
                  onValueChange={addDesignFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isDesignFormFieldValid("price"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="price">Price<span className='text-danger'>*</span></label>
              </span>
              {getDesignFormErrorMessage("price")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
              <span className='mt-3'>
                <FileUpload
                  id="productImg"
                  name="demo[]"
                  accept="image/*"
                  maxFileSize={1000000}
                  chooseLabel="Design Image"
                  customUpload
                  uploadHandler={(e) => {
                    const dataValue = e.files[0];
                    viewMode === 1 ? setSelectedImage(dataValue) : "";
                    // console.log("fileVal", dataValue);
                    viewMode === 2 ? getPreSignedUrl(dataValue, "") : "";
                  }}
                  emptyTemplate={<p className="m-0">{selectedRowData?.image !== undefined ? <img width={50} src={selectedRowData?.image} alt={"img"} /> : "Drag and drop files to here to upload."}</p>}
                />
              </span>
              {getDesignFormErrorMessage("productImg")}
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
                setViewMode(0);
                addDesignFormik.resetForm();
                setFilterDesignData(null);
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

  // === show success message ==== ===
  const showFileUploadMessage = (severity) => {
    toast.current.show({
      severity: severity == 'success' ? 'success' : 'error',
      summary: severity === 'success' ? "Uploaded" : "Oops",
      detail: severity === 'success' ? 'File has been successfully uploaded' : "Something went wrong.",
      life: 3000
    });
  }

  // === show success message ==== ===
  const showAddMessage = (severity) => {
    toast.current.show({
      severity: severity == 'success' ? 'success' : 'error',
      summary: severity === 'success' ? "Created" : "Oops",
      detail: severity === 'success' ? 'Design has been successfully created' : "Something went wrong",
      life: 3000
    });
  }

  // === show success message ==== ===
  const showUpdateMessage = (severity) => {
    toast.current.show({
      severity: severity == 'success' ? 'success' : 'error',
      summary: severity === 'success' ? "Updated" : "Oops",
      detail: severity === 'success' ? 'Design has been successfully updated' : "Something went wrong",
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
    deleteProductDesignsData();
    // console.log("accepted");
  }

  const reject = () => {
    toast.current.show({
      severity: 'warn',
      summary: 'Rejected',
      detail: 'Product design not deleted.',
      life: 3000
    });
  }

  // === ===  rowClickHandelar === ===
  const rowClickHandelar = (rd) => {
    const dt = rd.data;
    // console.log("rowData", dt);
    getFilterProductDesignsData(dt?.product_id?._id)
    setSelectedRowData(dt);
    // if (viewMode === 2) {
    addDesignFormik.setFieldValue("productName", dt?.product_id?._id);
    addDesignFormik.setFieldValue("material", dt?.metal);
    addDesignFormik.setFieldValue("addOn", dt?.add_on);
    addDesignFormik.setFieldValue("price", dt?.price);
    addDesignFormik.setFieldValue("productImg", dt?.image);
    addDesignFormik.setFieldValue("productDesign", dt?.name);
    // }
  }



  return (
    <div className="datatable-doc-demo">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Do you really want to delete this product design?"
        header="Delete Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => {
          // deleteProductDesignsData();
          accept();
        }}
        reject={reject}
      />
      {viewMode === 1 || viewMode === 2 ? addDesignForm() :
        <div className="">
          <DataTable
            value={designData}
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
            globalFilterFields={[
              'name',
              'image',
              'product_id.product_name',
              'product_id.product_category',
              'price',
              'status',
              'metal',
              'add_on',
              'price'
            ]}
            emptyMessage="No astrologers found"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              field="image"
              header="Image"
              body={(rowData) => {
                return rowData.image !== undefined ? <img width={30} src={`${rowData.image}`} alt={rowData.image} className="product-image" /> :
                  <Avatar label={rowData.name.charAt(0)} className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />;
              }}
              sortable
            // style={{ cursor: "pointer" }}
            />
            <Column
              field="product_id.product_name"
              header="Product Name"
              sortable
            // style={{ cursor: "pointer" }}
            />
            <Column
              field="product_id.product_category"
              header="Product category"
              body={(rd) => {
                const val = productCatagory.filter((item) => {
                  return item.code === rd.product_id?.product_category
                })
                const subVal = productSubCatagory.filter((item) => {
                  return item.code === rd?.product_id?.product_sub_category
                })
                return (
                  <span>
                    {val[0].name}
                    {rd?.product_id?.product_sub_category !== undefined ?
                      <i className='text-muted'>({subVal[0].name})</i> : ""}
                  </span>
                )
              }}
              sortable
            // style={{ cursor: "pointer" }}
            />
            <Column
              field="name"
              header="Design Name"
              sortable
            // style={{ cursor: "pointer" }}
            />
            <Column
              field="add_on"
              header="Add On"
              body={(rd) => {
                const val = addOnList.filter((item) => {
                  return item?.code == rd?.add_on
                })
                return (
                  <span>{val[0]?.name}</span>
                )
              }}
              sortable
            // style={{ cursor: "pointer" }}
            />
            <Column
              field="metal"
              header="Material"
              body={(rd) => {
                const val = materialList.filter((item) => {
                  return item?.code == rd?.metal
                })
                return (
                  <span>{val[0]?.name}</span>
                )
              }}
              sortable
            // style={{ cursor: "pointer" }}
            />
            <Column
              header="Price"
              field="price"
              sortable
            // style={{ cursor: "pointer" }}
            />
            <Column
              // field=""
              header="Actions"
              body={actionHandel}
            // sortable
            // style={{ textAlign: 'center', cursor: "pointer" }}
            />
          </DataTable>
        </div>}
    </div>
  )
}

export default ProductDesign