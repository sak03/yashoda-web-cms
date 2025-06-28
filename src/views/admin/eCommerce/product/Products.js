import React, { useState, useEffect, useRef } from 'react'
import { AppConstants } from '../../../../constants/constants';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from "formik";
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from "primereact/utils";
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useSelector } from "react-redux";
import { setEditMOde } from '../../../../redux/actions/editModeAction';
import { useDispatch } from 'react-redux';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { CListGroup, CTooltip } from '@coreui/react';
import '../eCommerce.css'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import {productCatagory, productSubCatagory, qualityType } from '../../../../utils/dropDownData'
import { Avatar } from 'primereact/avatar';

const Products = () => {
  // const userInfo = useSelector((state) => state.AuthReduer.token.data);
  const userInfo = JSON.parse(localStorage.getItem('token'));
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [statusSwitch, setStatusSwitch] = useState(true);
  const [viewMode, setViewMode] = useState(0);
  const [productData, setProductData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);

  const productLabel = [
    { name: "None" },
    { name: "New Arrival" },
    { name: "Sold Out" }
  ]

  const productFeatured = [
    { name: "Yes" },
    { name: "No" },
  ]

  useEffect(() => {
    getProductData();
    dispatch(setEditMOde({ editModeVal: 0, responce: "" }))
  }, [])

  // ===  add product formik == == 
  const addProductFormik = useFormik({
    initialValues: {
      productName: "",
      subTitle: "",
      productLabel: "",

      quality: "",
      productFeatured: "",
      productCatagory: "",
      productSubCatagory: "",

      description: "",
      pricePerRatti: "",
      discountPerRatti: "",
      // country: "",

      thumbnainImg: "",
      videoUrl: "",
      otherImages: ""
    },
    validate: (data) => {
      let errors = {};

      // ===== row first =======
      if (!data.productName) {
        errors.productName = "Please enter product name.";
      }
      if (!data.subTitle) {
        errors.subTitle = "Please enter sub title";
      }
      if (!data.productLabel) {
        errors.productLabel = "Please select product label";
      }

      if (!data.productFeatured) {
        errors.productFeatured = "Please select product featured";
      }
      if (!data.productCatagory) {
        errors.productCatagory = "Please select product catagory";
      }
      if (data.productCatagory === "gemstone" && !data.productSubCatagory) {
        errors.productSubCatagory = "Please select product sub catagory";
      }

      if (!data.pricePerRatti) {
        errors.pricePerRatti = "Please enter price per ratti";
      }

      if (!data.discountPerRatti) {
        errors.discountPerRatti = "Please enter discount price per ratti";
      }
      if (!data.quality) {
        errors.quality = "Please select quality type";
      }
      // if (!data.country) {
      //   errors.country = "Please select country";
      // }

      if (!data.description) {
        errors.description = "Please ender product description";
      }

      // console.log("formikError", errors);
      return errors;
    },
    onSubmit: (data) => {
      // console.log("formikData", data)
      viewMode === 1 ? addNewProduct(data) : updateProduct(data);
    },
  });
  const isProductFormFieldValid = (name) =>
    !!(addProductFormik.touched[name] && addProductFormik.errors[name]);
  const getProductFormErrorMessage = (name) => {
    return (
      isProductFormFieldValid(name) && (
        <small className="p-error">{addProductFormik.errors[name]}</small>
      )
    );
  };

  // ===  add product formik == == 
  const addProductImageFormik = useFormik({
    initialValues: {
      thumbnainImg: "",
      videoUrl: "",
      otherImages: ""
    },
    validate: (data) => {
      let errors = {};

      // console.log("formikError", errors);
      return errors;
    },
    onSubmit: (data) => {
      // console.log("imageFormik", data);
      updateProduct(data);
    },
  });
  const isProductImageFormFieldValid = (name) =>
    !!(addProductImageFormik.touched[name] && addProductImageFormik.errors[name]);
  const getProducImagetFormErrorMessage = (name) => {
    return (
      isProductImageFormFieldValid(name) && (
        <small className="p-error">{addProductImageFormik.errors[name]}</small>
      )
    );
  };

  // === get product data === ==== 
  const getProductData = async () => {
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
        setProductData(dt);
        // console.log("detProductData==>", dt);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  // === get product data === ====
  const addNewProduct = async (data) => {

    const postData = {
      product_name: data.productName,
      subtitle: data.subTitle,
      price_per_ratti: data.pricePerRatti,
      discount_price_per_ratti: data.discountPerRatti,
      description: data.description,
      product_category: data.productCatagory,
      product_sub_category: data.productCatagory === "gemstone" ? data.productSubCatagory : "",
      label: data.productLabel,
      is_featured: data.productFeatured == "Yes" ? true : false,
      status: statusSwitch === true ? true : false,
      quality: data.quality,
    }

    // console.log("postData", postData);
    await axios
      .post(`${AppConstants.Api_BaseUrl}products`, postData,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        if (dt.data) {
    setViewMode(3)
          // getProductData();
          setSelectedProduct(dt.data);
          console.log("addProductData==>", dt);
          // setViewMode(0);
          showSaveMessage('success');
          // addProductFormik.resetForm();
          // showAddMessage('success');
        }
        if (dt.error) {
          getProductData();
          showSaveMessage('error');
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
        showAddMessage('error');
        setViewMode(0);
      })
  }

  // === get product data === ====
  const updateProduct = async (data) => {

    const postData = {
      product_name: viewMode === 3 ? selectedProduct?.product_name : data.productName,
      subtitle: viewMode === 3 ? selectedProduct?.subtitle : data.subTitle,
      price_per_ratti: viewMode === 3 ? selectedProduct?.price_per_ratti : data.pricePerRatti,
      discount_price_per_ratti: viewMode === 3 ? selectedProduct?.discount_price_per_ratti : data.discountPerRatti,
      description: viewMode === 3 ? selectedProduct?.description : data.description,
      video_url: data.videoUrl,
      product_category: viewMode === 3 ? selectedProduct?.product_category : data.productCatagory,
      product_sub_category: viewMode === 3 ? "" : data.productCatagory === "gemstone" ? data.productSubCatagory : "",
      thumbnail_image: data.thumbnainImg,
      other_images: data.otherImages,
      label: viewMode === 3 ? selectedProduct?.label : data.productLabel,
      is_featured: viewMode === 3 ? selectedProduct?.is_featured : data.productFeatured == "Yes" ? true : false,
      status: viewMode === 3 ? selectedProduct?.status : statusSwitch === true ? true : false,
      quality: viewMode === 3 ? selectedProduct?.quality : data.quality,
    }


    // console.log("postData", postData)
    await axios
      .put(`${AppConstants.Api_BaseUrl}products/${selectedProduct._id}`, postData,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res.data;
        if (dt.data) {
          getProductData();
          setViewMode(0);
          addProductFormik.resetForm();
          viewMode === 3 ? showAddMessage('success') : showUpdateMessage('success');
        }

        if (dt.error) {
          getProductData();
          viewMode === 3 ? showAddMessage('error') : showUpdateMessage('error');
          console.log(dt.error);
        }
        // console.log("productData==>", dt);

      })
      .catch((err) => {
        console.log(err);
        showAddMessage('error');
        // setViewMode(0);
      })
  }

  // === add product designs data === ====
  const deleteProductData = async () => {

    await axios
      .delete(`${AppConstants.Api_BaseUrl}products/${selectedProduct._id}`,
        {
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        })
      .then((res) => {
        const dt = res;
        // console.log("deleted", res);
        if (dt.status != 200) {
          console.log(dt.error);
          toast.current.show({
            severity: 'error',
            summary: 'Oops',
            detail: 'Something went wrong.',
            life: 3000
          });
        }
        if (dt.status == 200) {
          getProductData();
          toast.current.show({
            severity: 'info',
            summary: 'Deleted',
            detail: 'Product has been successfully deleted.',
            life: 3000
          });
        }
      })
      .catch((err) => {
        console.log(err);
        showUpdateMessage('error');
      })
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
              }}
            />
          </span>
        </div>
        {/* </div> */}
      </div >
    )
  }
  const header = renderHeader();

  // ===== get image url to s3 ==== =====
  const getPreSignedUrl = async (data, flag) => {
    const url = flag === 1 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=products/${selectedProduct._id}/thumbnail_image&content_type=image/jpeg` :
      flag === 2 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=products/${selectedProduct._id}&content_type=video/mp4` : "";
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
        // console.log("signedUrl", dt)
        uploadFileToS3(dt, data, flag);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const uploadFileToS3 = async (urlData, fileVal, flag) => {
    const url = urlData.signedUrl
    // console.log("selectedFile", fileVal);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': flag === 2 ? 'video/mp4' : 'image/jpeg'
        },
        body: fileVal,
      });

      if (response.ok) {
        if (viewMode === 3) {
          flag === 1 ? addProductImageFormik.setFieldValue("thumbnainImg", urlData.url) :
            flag === 2 ? addProductImageFormik.setFieldValue("videoUrl", urlData.url) : "";
        }

        if (viewMode !== 3) {
          flag === 1 ? addProductFormik.setFieldValue("thumbnainImg", urlData.url) :
            flag === 2 ? addProductFormik.setFieldValue("videoUrl", urlData.url) : "";
        }

        showFileUploadMessage('success');
      } else {
        showFileUploadMessage('error');
        console.error('File upload failed:', response.statusText);
      }
    } catch (error) {
      showFileUploadMessage('error');
      console.error('An error occurred while uploading the file:', error);
    }
  };

  // ===== get image url to s3 ==== =====
  const getOtherImgPreSignedUrl = async (data) => {
    const fileUrl = [];
    viewMode === 3 ? addProductImageFormik.setFieldValue("otherImages", fileUrl) :
      addProductFormik.setFieldValue("otherImages", fileUrl);
    // console.log("thumbnailImage", fileUrl);

    data.length !== 0 ? (
      data.map((item) => {
        const fileName = item.name.split('.');
        (
          axios
            .get(`${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=products/${selectedProduct._id}/thumbnail_images/${fileName[0]}&content_type=image/jpeg`,
              {
                headers: {
                  Authorization: userInfo.token,
                  "Content-Type": "application/json",
                },
              })
            .then((res) => {
              const dt = res.data.data;
              fileUrl.push(dt.url)
              // console.log("signedUrl", fileUrl);
              uploadOtherImgToS3(dt, item);
            })
            .catch((err) => {
              console.log(err);
            })
        )
      }
      )
    )
      : "";

  }

  const uploadOtherImgToS3 = async (urlData, fileVal) => {
    const url = urlData.signedUrl;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg'
        },
        body: fileVal,
      });

      if (response.ok) {
        showFileUploadMessage('success');
      } else {
        showFileUploadMessage('error');
        console.error('File upload failed:', response.statusText);
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

  // ==== add product form === ===
  const addProductForm = () => {
    return (
      <form onSubmit={addProductFormik.handleSubmit}>
        <div className='form-demo card p-2'>
          <div className="d-flex justify-content-between my-2 mx-4">
            <div className="d-flex justify-content-between my-2 mx-4">
              <p className="text-primary">
                <CTooltip content='Back' position='left'>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setViewMode(0);
                      addProductFormik.resetForm();
                      // setFilterDesignData(null);
                    }}
                  >
                    <i className="pi pi-arrow-left mr-2"></i>
                  </span>
                </CTooltip>
              </p>
            </div>
            <div className="d-flex mr-1 align-items-center">
              <p className="para-publish mt-3 mx-1">Status</p>
              <InputSwitch
                id="status"
                name="status"
                style={{ height: "1.35rem" }}
                checked={statusSwitch}
                onChange={(e) => setStatusSwitch(e.value)}
              />
            </div>
          </div>
          <div className="row mx-3">
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="productName"
                  value={addProductFormik.values.productName}
                  onChange={addProductFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("productName"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="productName">Product Name<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("productName")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="subTitle"
                  value={addProductFormik.values.subTitle}
                  onChange={addProductFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("subTitle"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="subTitle">Sub Title<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("subTitle")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="productLabel"
                  inputId="dropdown"
                  options={productLabel}
                  value={addProductFormik.values.productLabel}
                  onChange={addProductFormik.handleChange}
                  optionLabel="name"
                  optionValue='name'
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("productLabel"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="productLabel">Product Label<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("productLabel")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="productFeatured"
                  inputId="dropdown"
                  options={productFeatured}
                  value={addProductFormik.values.productFeatured}
                  onChange={addProductFormik.handleChange}
                  optionLabel="name"
                  optionValue='name'
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("productFeatured"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="productFeatured">Featured Product<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("productFeatured")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="productCatagory"
                  inputId="dropdown"
                  options={productCatagory}
                  value={addProductFormik.values.productCatagory}
                  onChange={addProductFormik.handleChange}
                  optionLabel="name"
                  optionValue='code'
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("productCatagory"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="productCatagory">Product Catagory<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("productCatagory")}
            </div>
            {addProductFormik.values.productCatagory === "gemstone" ?
              <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
                <span className="p-float-label">
                  <Dropdown
                    id="productSubCatagory"
                    inputId="dropdown"
                    options={productSubCatagory}
                    value={addProductFormik.values.productSubCatagory}
                    onChange={addProductFormik.handleChange}
                    optionLabel="name"
                    optionValue='code'
                    className={
                      (classNames({
                        "p-invalid": isProductFormFieldValid("productSubCatagory"),
                      }),
                        "p-inputtext-sm w-100 borderClass")
                    }
                  />
                  <label htmlFor="productSubCatagory">Product Sub Catagory<span className='text-danger'>*</span></label>
                </span>
                {getProductFormErrorMessage("productSubCatagory")}
              </div> : ""}
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="pricePerRatti"
                  value={addProductFormik.values.pricePerRatti}
                  onChange={addProductFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("pricePerRatti"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="pricePerRatti">Price Per Ratti<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("pricePerRatti")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <InputText
                  id="discountPerRatti"
                  value={addProductFormik.values.discountPerRatti}
                  onChange={addProductFormik.handleChange}
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("discountPerRatti"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="discountPerRatti">Discount Price Per Ratti<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("discountPerRatti")}
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-4 mt-4">
              <span className="p-float-label">
                <Dropdown
                  id="quality"
                  inputId="dropdown"
                  options={qualityType}
                  value={addProductFormik.values.quality}
                  onChange={addProductFormik.handleChange}
                  optionLabel="name"
                  optionValue='code'
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("quality"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="quality">Quality Type<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("quality")}
            </div>
          </div>
          <div className="row mx-3 mt-2">
            <div className=" col-sm-12 col-md-12 col-lg-12 mt-4">
              <span className="p-float-label">
                <InputTextarea
                  id="description"
                  value={addProductFormik.values.description}
                  onChange={addProductFormik.handleChange}
                  rows={2}
                  className={
                    (classNames({
                      "p-invalid": isProductFormFieldValid("description"),
                    }),
                      "p-inputtext-sm w-100 borderClass")
                  }
                />
                <label htmlFor="description">Description<span className='text-danger'>*</span></label>
              </span>
              {getProductFormErrorMessage("description")}
            </div>
          </div>
          {viewMode === 1 ? "" :
            <div className="row mx-3">
              <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                <span className='mt-3'>
                  <FileUpload
                    id="thumbnainImg"
                    name="demo[]"
                    accept="image/*"
                    maxFileSize={1000000}
                    chooseLabel="Select images"
                    customUpload
                    uploadHandler={(e) => {
                      const dataValue = e.files[0];
                      // console.log("fileVal", dataValue);
                      getPreSignedUrl(dataValue, 1);
                    }}
                    emptyTemplate={<p className="m-0">{selectedProduct.thumbnail_image !== undefined ? <img width={50} src={selectedProduct.thumbnail_image} alt={"img"} /> : "Drag and drop files to here to upload."}</p>}
                  />
                </span>
              </div>
              <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                <span className='mt-3'>
                  <FileUpload
                    id="videoUrl"
                    name="demo[]"
                    accept="video/*"
                    maxFileSize={5000000}
                    chooseLabel="Select video"
                    customUpload
                    uploadHandler={(e) => {
                      const dataValue = e.files[0];
                      // console.log("fileVal", dataValue);
                      getPreSignedUrl(dataValue, 2);
                    }}
                    emptyTemplate={<p className="m-0">{selectedProduct.video_url !== undefined ?
                      <video controls width={100} height={100}>
                        <source src={selectedProduct.video_url} type="video/mp4" />
                        Sorry, your browser doesn't support embedded videos.
                      </video>
                      : 'Drag and drop files to here to upload.'}</p>}
                  />
                </span>
              </div>
              <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                <span className='mt-3'>
                  <FileUpload
                    id="otherImages"
                    name="demo[]"
                    multiple
                    accept="image/*"
                    maxFileSize={1000000}
                    chooseLabel="Select other images"
                    customUpload
                    uploadHandler={(e) => {
                      const dataValue = e.files;
                      // console.log("fileVal", dataValue);
                      getOtherImgPreSignedUrl(dataValue);
                    }}
                    emptyTemplate={<p className="m-0">
                      {selectedProduct.other_images.length !== 0 ?
                        selectedProduct?.other_images && selectedProduct?.other_images.map((item) => {

                          return <img width={50} src={item} alt={"img"} className='mx-2' />
                        })
                        : "Drag and drop files to here to upload."}
                    </p>}
                  />
                </span>
              </div>
            </div>
          }

          <div className="modal-footer d-flex justify-content-end my-3 mx-4">
            <Button
              label={viewMode === 1 ? " Save and Next" : "Update"}
              type="submit"
              className="bg-primary border-0  p-button-md  btn-color p-button-raised"
            />
            <Button
              onClick={() => {
                setViewMode(0)
                addProductFormik.resetForm();
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

  const addProductImage = () => {
    return (
      <form onSubmit={addProductImageFormik.handleSubmit}>
        <div className='form-demo card p-2'>
          <div className="d-flex justify-content-between my-2 mx-4">
            <div className="d-flex justify-content-between my-2 mx-4">
              <p className="text-primary">
                <CTooltip content='Back' position='left'>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setViewMode(1);
                      addProductImageFormik.resetForm();
                      // setFilterDesignData(null);
                    }}
                  >
                    <i className="pi pi-arrow-left mr-2"></i>
                  </span>
                </CTooltip>
              </p>
            </div>
          </div>
          <div className="row mx-3">
            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
              <span className='mt-3'>
                <FileUpload
                  id="thumbnainImg"
                  name="demo[]"
                  accept="image/*"
                  maxFileSize={1000000}
                  chooseLabel="Select images"
                  customUpload
                  uploadHandler={(e) => {
                    const dataValue = e.files[0];
                    // console.log("fileVal", dataValue);
                    getPreSignedUrl(dataValue, 1);
                  }}
                  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                />
              </span>
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
              <span className='mt-3'>
                <FileUpload
                  id="videoUrl"
                  name="demo[]"
                  accept="video/*"
                  maxFileSize={5000000}
                  chooseLabel="Select video"
                  customUpload
                  uploadHandler={(e) => {
                    const dataValue = e.files[0];
                    // console.log("fileVal", dataValue);
                    getPreSignedUrl(dataValue, 2);
                  }}
                  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                />
              </span>
            </div>
            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
              <span className='mt-3'>
                <FileUpload
                  id="otherImages"
                  name="demo[]"
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  chooseLabel="Select other images"
                  customUpload
                  uploadHandler={(e) => {
                    const dataValue = e.files;
                    // console.log("fileVal", dataValue);
                    getOtherImgPreSignedUrl(dataValue);
                  }}
                  emptyTemplate={<p className="m-0">
                    Drag and drop files to here to upload.
                  </p>}
                />
              </span>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-end my-3 mx-4">
            <Button
              label="Save"
              type="submit"
              className="bg-primary border-0  p-button-md  btn-color p-button-raised"
            />
            <Button
              onClick={() => {
                setViewMode(0)
                addProductImageFormik.resetForm();
              }}
              label={"Cancel"}
              style={{ marginLeft: "10px" }}
              className="bg-danger border-0 p-button-md p-button-raised"
            />
          </div>
        </div>
      </form>
    )
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

  // === show success message ==== ===
  const showSaveMessage = (severity) => {
    toast.current.show({
      severity: severity == 'success' ? 'success' : 'error',
      summary: severity === 'success' ? "Saved" : "Oops",
      detail: severity === 'success' ? 'Product has been successfully saved' : "Something went wrong",
      life: 3000
    });
  }

  // === show success message ==== ===
  const showAddMessage = (severity) => {
    toast.current.show({
      severity: severity == 'success' ? 'success' : 'error',
      summary: severity === 'success' ? "Added" : "Oops",
      detail: severity === 'success' ? 'Product has been successfully added' : "Something went wrong",
      life: 3000
    });
  }

  // === show success message ==== ===
  const showUpdateMessage = (severity) => {
    toast.current.show({
      severity: severity == 'success' ? 'success' : 'error',
      summary: severity === 'success' ? "Updated" : "Oops",
      detail: severity === 'success' ? 'Product has been successfully updated' : "Something went wrong",
      life: 3000
    });
  }

  const accept = () => {
    deleteProductData();
    // console.log("accepted");
  }

  const reject = () => {
    toast.current.show({
      severity: 'warn',
      summary: 'Rejected',
      detail: 'Product not deleted.',
      life: 3000
    });
  }

  // === ===  rowClickHandelar === ===
  const rowClickHandelar = (rd) => {
    const dt = rd.data;
    // setViewMode(2);
    // console.log("rowData", dt);
    setSelectedProduct(dt);
    addProductFormik.setFieldValue('productName', dt.product_name);
    addProductFormik.setFieldValue('subTitle', dt.subtitle);
    addProductFormik.setFieldValue('productLabel', dt.label);
    addProductFormik.setFieldValue('quality', dt.quality);
    addProductFormik.setFieldValue('productFeatured', dt.is_featured === true ? "Yes" : "No");
    addProductFormik.setFieldValue('productCatagory', dt.product_category);
    addProductFormik.setFieldValue('productSubCatagory',dt?.product_sub_category && dt?.product_sub_category);
    addProductFormik.setFieldValue('description', dt.description);
    addProductFormik.setFieldValue('pricePerRatti', dt.price_per_ratti);
    addProductFormik.setFieldValue('discountPerRatti', dt.discount_price_per_ratti);
    addProductFormik.setFieldValue('thumbnainImg', dt.thumbnail_image);
    addProductFormik.setFieldValue('videoUrl', dt.video_url);
    addProductFormik.setFieldValue('otherImages', dt.other_images);
  }

  return (
    <div className="datatable-doc-demo">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Do you really want to delete this product?"
        header="Delete Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => {
          // deleteProductDesignsData();
          accept();
        }}
        reject={reject}
      />
      {viewMode === 1 || viewMode === 2 ? addProductForm() :
        viewMode === 3 ? addProductImage() :
          <div className="">
            <DataTable
              value={productData}
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
                'ProductName',
                'product_category',
                'quality',
                'image',
                'price_per_ratti',
                'discount_price_per_ratti',
                'label',
                'status',
                'thumbnail_image',
              ]}
              emptyMessage="No products found"
            >
              <Column
                field="thumbnail_image"
                header="Image"
                body={(rowData) => {
                  return rowData.thumbnail_image !== undefined ? <img width={30} src={`${rowData.thumbnail_image}`} alt={rowData.thumbnail_image} className="product-image" /> :
                    <Avatar label={rowData.product_name.charAt(0)} className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />;
                }}
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="product_name"
                header="Name"
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="product_category"
                header="Category"
                body={(rd) => {
                  const val = productCatagory.filter((item)=>{
                    return item.code === rd.product_category
                  })
                  const subVal = productSubCatagory.filter((item)=>{
                    return item.code === rd.product_sub_category
                  })
                  // console.log('subVal', subVal, rd.product_category);
                  return (
                    <span>
                      {val[0].name}
                      {rd?.product_sub_category ?
                        <i className='text-muted'>({subVal[0]?.name})</i> : ""}
                    </span>
                  )
                }}
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="quality"
                header="Quality"
                body={(rd)=>{
                  const val = qualityType.filter((item)=>{
                    return item.code === rd.quality
                  })
                  return(
                    <span>{val[0].name}</span>
                  )
                }}
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                header="Price"
                field="price_per_ratti"
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                header="Discounted Price"
                field="discount_price_per_ratti"
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="label"
                header="Label"
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                field="status"
                header="Status"
                body={(rd) => {
                  return (
                    <span>{rd.status == true ? <span className='text-success'>Active</span> : <span className='text-danger'>Inactive</span>}</span>
                  )
                }}
                sortable
              // style={{ cursor: "pointer" }}
              />
              <Column
                header="Actions"
                body={actionHandel}
              />
            </DataTable>
          </div>}
    </div>
  )
}

export default Products