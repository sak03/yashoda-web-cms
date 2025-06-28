import React, { useState, useRef, useEffect, useCallback } from 'react'
import { AppConstants } from '../../../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { setAstroViewMode } from '../../../../redux/actions/astroViewModeAction';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import { validateEmail } from '../../../../utils/validations';
import { CTooltip } from '@coreui/react';
import './astro.css'
import { setSelectedAstro } from '../../../../redux/actions/selectedAstroAction';
import { experienceList, skillList, specializationList, statusList } from '../../../../utils/dropDownData'

const AstroAddUpdateForm = () => {
    // const userInfo = useSelector((state) => state.AuthReduer.token.data);
    const userInfo = JSON.parse(localStorage.getItem('token'));
    const viewMode = useSelector((state) => state.astroViewMove);
    const [formMode, setFormMode] = useState(0);
    // const [statusSwitch, setStatusSwitch] = useState(false);
    const selectedAstroData = useSelector((state) => state.selectedAstro);
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [countryData, setCountryData] = useState([]);
    const [countriesList, setCountriesList] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [thumbNailImg, setThumbNailImg] = useState();
    const maxYear = new Date().getFullYear();
    // let thumbNailImg;

    // console.log("thumbNailImg", thumbNailImg)


    const genderList = [
        { name: "Male", code: "male" },
        { name: "Female", code: "female" },
    ]
    const languageList = [
        { name: "Hindi", code: "hindi" },
        { name: "English", code: "english" },
    ]

    useEffect(() => {
        // if (viewMode == 2){
        getcountryList();
        // }
    }, [])

    // ==== set form field data ===============
    useEffect(() => {
        // console.log("selectedRoData", selectedAstroData);
        // thumbNailImg = selectedAstroData?.thumbnail_images;
        setThumbNailImg(selectedAstroData?.thumbnail_images)
        if (viewMode === 3 && selectedAstroData !== undefined) {
            // selectedAstroData?.status === "pending" ? setStatusSwitch(false) : setStatusSwitch(true);
            addAstroFormik.setFieldValue("status", selectedAstroData?.status);

            const name = selectedAstroData?.name.split(" ");

            addAstroFormik.setFieldValue("fname", name[0]);
            addAstroFormik.setFieldValue("lname", name[name.length - 1]);
            addAstroFormik.setFieldValue("email", selectedAstroData?.email);

            addAstroFormik.setFieldValue("mobile", selectedAstroData?.phone);
            addAstroFormik.setFieldValue("dob", new Date(selectedAstroData?.date_of_birth));
            addAstroFormik.setFieldValue("experience", selectedAstroData?.experience?.toString());

            addAstroFormik.setFieldValue("gender", selectedAstroData?.gender);
            addAstroFormik.setFieldValue("profileImage", selectedAstroData.profile_image);
            // addAstroFormik.setFieldValue("thumbnailImage", selectedAstroData?.thumbnail_images);
            addAstroFormik.setFieldValue("videoUrl", selectedAstroData?.video_url);
            addAstroFormik.setFieldValue("chequePassbookPhoto", selectedAstroData.bank_info.bank_document_image);

            addAstroFormik.setFieldValue("language", selectedAstroData?.languages);

            addAstroFormik.setFieldValue("specialization", selectedAstroData?.specialization);
            addAstroFormik.setFieldValue("skills", selectedAstroData?.skills);

            addAstroFormik.setFieldValue("availableForChat", selectedAstroData?.is_available_for_call);
            addAstroFormik.setFieldValue("chatPrice", selectedAstroData?.call_price);
            addAstroFormik.setFieldValue("availableForCall", selectedAstroData?.is_available_for_chat);
            addAstroFormik.setFieldValue("callPrice", selectedAstroData?.chat_price);

            addAstroFormik.setFieldValue("country", selectedAstroData?.address?.locality);

            addAstroFormik.setFieldValue("pinCode", selectedAstroData?.address?.pin_code);
            addAstroFormik.setFieldValue("description", selectedAstroData?.description);

            addAstroFormik.setFieldValue("bankName", selectedAstroData?.bank_info?.bank_name);
            addAstroFormik.setFieldValue("accountNumber", selectedAstroData?.bank_info?.account_number);
            addAstroFormik.setFieldValue("ifscCode", selectedAstroData?.bank_info?.ifsc_code);

            addAstroFormik.setFieldValue("aadhaarNumber", selectedAstroData?.kyc?.aadhaar_number);
            addAstroFormik.setFieldValue("aadhaarImg1", selectedAstroData?.kyc?.aadhaar_images[0]?.document_url);
            addAstroFormik.setFieldValue("aadhaarImg2", selectedAstroData?.kyc?.aadhaar_images[1]?.document_url);

            addAstroFormik.setFieldValue("panNumber", selectedAstroData.kyc?.pan_card_number);
            addAstroFormik.setFieldValue("panImg1", selectedAstroData?.kyc?.pan_card_image);
        }
    }, [])

    useEffect(() => {
        if (viewMode === 3 && selectedAstroData !== undefined) {
            const filterCountry = countryData && countryData.filter((item) => {
                return selectedAstroData?.address?.locality === item.name
            })
            getstatelist(filterCountry[0]?.iso2)
            addAstroFormik.setFieldValue("state", selectedAstroData?.address?.state);
        }
    }, [countryData]);

    useEffect(() => {
        if (viewMode === 3 && selectedAstroData !== undefined) {
            setTimeout(() => {
                const filterCountry = countryData && countryData.filter((item) => {
                    return selectedAstroData?.address?.locality === item.name
                })

                const filterState = stateData && stateData.filter((item) => {
                    return selectedAstroData?.address.state === item.name
                })
                getcitieslist(filterState[0].iso2, filterCountry[0].iso2);
                addAstroFormik.setFieldValue("city", selectedAstroData?.address?.city);
            }, 1000);
        }
    }, [stateData])



    const addAstroFormik = useFormik({
        initialValues: {
            status: "",

            fname: "",
            lname: "",
            email: "",

            mobile: "",
            dob: "",
            experience: "",

            gender: "",
            profileImage: "",
            thumbnailImage: [],
            videoUrl: "",

            language: "",

            specialization: "",
            skills: "",

            country: "",
            state: "",
            city: "",
            pinCode: "",
            description: "",

            bankName: "",
            accountNumber: "",
            ifscCode: "",
            upiId: "",
            chequePassbookPhoto: "",

            aadhaarNumber: "",
            aadhaarImg1: "",
            aadhaarImg2: "",

            panNumber: "",
            panImg1: "",

            availableForChat: false,
            chatPrice: "",
            availableForCall: false,
            callPrice: ""
        },
        validate: (data) => {
            let errors = {};

            // ===== row first =======
            if (!data.fname) {
                errors.fname = "Please enter first name.";
            }
            if (!data.lname) {
                errors.lname = "Please enter last name.";
            }
            if (!data.email) {
                errors.email = "Please enter email id.";
            }
            if (data.email && !validateEmail(data.email)) {
                errors.email = "Please enter valid email.";
            }

            if (!data.mobile) {
                errors.mobile = "Please enter mobile no.";
            }
            if (data.mobile.length !== 10) {
                errors.mobile = "Mobile no. must have 10 digits";
            }

            if (!data.dob) {
                errors.dob = "Please select date of birth.";
            }

            // if (!data.gender) {
            //     errors.gender = "Please select gender.";
            // }

            if (!data.language) {
                errors.language = "Please select language.";
            }
            if (!data.experience) {
                errors.experience = "Please select experience.";
            }

            if (!data.specialization) {
                errors.specialization = "Please select specialization.";
            }
            if (!data.skills) {
                errors.skills = "Please select skills.";
            }

            if (!data.country) {
                errors.country = "Please select country.";
            }
            if (!data.state) {
                errors.state = "Please select state.";
            }
            if (!data.city) {
                errors.city = "Please select city.";
            }
            if (!data.pinCode) {
                errors.pinCode = "Please enter pinCode.";
            }

            if (!data.description) {
                errors.description = "Please enter description.";
            }


            if (!data.bankName) {
                errors.bankName = "Please enter bank name.";
            }
            if (!data.accountNumber) {
                errors.accountNumber = "Please enter account number.";
            }
            if (!data.ifscCode) {
                errors.ifscCode = "Please enter IFSC code.";
            }
            if (data.ifscCode.length !== 11) {
                errors.ifscCode = "IFSC code must be 11 character";
            }

            if (!data.aadhaarNumber) {
                errors.aadhaarNumber = "Please enter aadhaar number.";
            }
            if (data.aadhaarNumber.length !== 12) {
                errors.aadhaarNumber = "Aadhaar number must have 12 digits.";
            }

            if (!data.panNumber) {
                errors.panNumber = "Please enter pan card number.";
            }
            if (data?.panNumber?.length !== 10) {
                errors.panNumber = "Pan card number must have 10 digits.";
            }

            if (!data.chatPrice && data.availableForChat === true) {
                errors.chatPrice = "Please enter chat price.";
            }
            if (!data.callPrice && data.availableForCall === true) {
                errors.callPrice = "Please enter call price.";
            }

            // console.log("testFormikDaat", errors);

            return errors;
        },
        onSubmit: (data) => {
            viewMode === 2 ? createAstrologers(data) : updateAstrologers(data);
        },
    });
    // const isAstroFormFieldValid = (name) =>
    //     !!(addAstroFormik.touched[name] && addAstroFormik.errors[name]);
    const isAstroFormFieldValid = (name) =>
        !!(addAstroFormik.errors[name] && addAstroFormik.values[name]) || !!(addAstroFormik.touched[name] && addAstroFormik.errors[name]);
    const getAstroFormErrorMessage = (name) => {
        return (
            isAstroFormFieldValid(name) && (
                <small className="p-error">{addAstroFormik.errors[name]}</small>
            )
        );
    };

    const addAstroImgFormik = useFormik({
        initialValues: {
            profileImage: "",
            thumbnailImage: [],
            videoUrl: "",

            chequePassbookPhoto: "",
            aadhaarImg1: "",
            aadhaarImg2: "",
            panImg1: "",
        },
        // validateOnChange: true,
        validate: (data) => {
            let errors = {};

            // if (!data.aadhaarImg1) {
            //     errors.aadhaarImg1 = "Please select aadhaar image(side 1).";
            // }
            // if (!data.aadhaarImg2) {
            //     errors.aadhaarImg2 = "Please select aadhaar image(side 2).";
            // }

            // if (!data.panImg1) {
            //     errors.panImg1 = "Please select pan card image(side 1).";
            // }

            // console.log("testFormikDaat", errors);

            return errors;
        },
        onSubmit: (data) => {
            // console.log("formikimgData", data);
            updateAstrologers(data);
        },
    });
    // const isAstroFormFieldValid = (name) =>
    //     !!(addAstroFormik.touched[name] && addAstroFormik.errors[name]);
    const isAstroImgFormFieldValid = (name) =>
        !!(addAstroImgFormik.errors[name] && addAstroImgFormik.values[name]) || !!(addAstroImgFormik.touched[name] && addAstroImgFormik.errors[name]);
    const getAstroImgFormErrorMessage = (name) => {
        return (
            isAstroImgFormFieldValid(name) && (
                <small className="p-error">{addAstroImgFormik.errors[name]}</small>
            )
        );
    };

    // === create astrologers data === ====
    const createAstrologers = async (data) => {
        setLoader(true);
        const postData = {
            name: data.fname + " " + data.lname,
            email: data.email,
            phone: data.mobile,
            gender: data.gender,
            experience: data.experience,
            chat_price: data.availableForChat === true ? data.chatPrice : 0,
            call_price: data.availableForCall === true ? data.callPrice : 0,
            date_of_birth: data.dob,
            is_available_for_chat: data.availableForChat,
            is_available_for_call: data.availableForCall,
            languages: data.language,
            skills: data.skills,
            specialization: data.specialization,
            description: data.description,
            address: {
                locality: data.country,
                city: data.city,
                state: data.state,
                pin_code: data.pinCode
            },
            bank_info: {
                bank_name: data.bankName,
                ifsc_code: data.ifscCode,
                account_number: data.accountNumber,
            },
            kyc: {
                aadhaar_number: data.aadhaarNumber,
                pan_card_number: data.panNumber,
            }

        }

        // console.log("postData", postData);
        await axios
            .post(`${AppConstants.Api_BaseUrl}astrologers/create`, postData,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                if (dt.data) {
                    showSavedMessage('success', "");
                    setFormMode(2);
                    dispatch(setSelectedAstro(dt.data))
                    // console.log("createdData", dt.data, selectedAstroData);
                }
                if (dt.error) {
                    showSavedMessage('error', dt.error);
                    console.log("res", dt.error)
                }
            })
    }

    // === create astrologers data === ====
    const updateAstrologers = async (data) => {
        setLoader(true);
        const postData = {
            name: formMode === 2 ? selectedAstroData.name : data.fname + " " + data.lname,
            experience: formMode === 2 ? selectedAstroData.experience : data.experience,
            chat_price: formMode === 2 ? selectedAstroData.chat_price : data.availableForChat === true ? data.chatPrice : 0,
            call_price: formMode === 2 ? selectedAstroData.call_price : data.availableForCall === true ? data.callPrice : 0,
            is_available_for_chat: formMode === 2 ? selectedAstroData.is_available_for_chat : data.availableForChat,
            is_available_for_call: formMode === 2 ? selectedAstroData.is_available_for_call : data.availableForCall,
            languages: formMode === 2 ? selectedAstroData.languages : data.language,
            skills: formMode === 2 ? selectedAstroData.skills : data.skills,
            specialization: formMode === 2 ? selectedAstroData.specialization : data.specialization,
            description: formMode === 2 ? selectedAstroData.description : data.description,
            address: {
                locality: formMode === 2 ? selectedAstroData.address.locality : data.country,
                city: formMode === 2 ? selectedAstroData.address.city : data?.city,
                state: formMode === 2 ? selectedAstroData.address.state : data.state,
                pin_code: formMode === 2 ? selectedAstroData.address.pin_code : data.pinCode
            },
            profile_image: data.profileImage,
            thumbnail_images: formMode === 2 ? data.thumbnailImage : [...thumbNailImg, ...data.thumbnailImage],
            video_url: data.videoUrl,
            bank_info: {
                bank_name: formMode === 2 ? selectedAstroData.bank_info.bank_name : data.bankName,
                ifsc_code: formMode === 2 ? selectedAstroData.bank_info.ifsc_code : data.ifscCode,
                account_number: formMode === 2 ? selectedAstroData.bank_info.account_number : data.accountNumber,
                bank_document_image: data.chequePassbookPhoto
            },
            kyc: {
                aadhaar_number: formMode === 2 ? selectedAstroData.kyc.aadhaar_number : data.aadhaarNumber,
                pan_card_number: formMode === 2 ? selectedAstroData.kyc.pan_card_number : data.panNumber,
                pan_card_image: data.panImg1,
                aadhaar_images: [
                    {
                        document_side: "front",
                        document_url: data.aadhaarImg1,
                    },
                    {
                        document_side: "back",
                        document_url: data.aadhaarImg2
                    }
                ]
            }

        }

        // console.log("postData", postData);
        await axios
            .put(`${AppConstants.Api_BaseUrl}astrologers/${selectedAstroData._id}`, postData,
                {
                    headers: {
                        Authorization: userInfo.token,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data;
                if (dt.data) {
                    formMode === 2 ? showAddMessage('success', "") : showUpdateMessage('success', "");
                    setTimeout(() => {
                        dispatch(setAstroViewMode(0));
                        addAstroFormik.resetForm();
                        setLoader(false);
                    }, 2000)
                    // dispatch(setEditMOde({ editModeVal: 3, responce: dt }));

                }
                if (dt.error) {
                    showUpdateMessage('error', dt.error);
                    setTimeout(() => {
                        setLoader(false);
                    }, 2000)
                    console.log("res", dt.error)
                    // dispatch(setEditMOde({ editModeVal: 3, responce: dt }));
                }
            })
    }

    // ====================== List of countries ========================//
    const updateStatus = async (status) => {

        await axios
            .put(`${AppConstants.Api_BaseUrl}astrologers/${selectedAstroData._id}/status/${status}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                        "Content-Type": "application/json",
                    },
                })
            .then((res) => {
                const dt = res.data.data;
                const statusData = statusList.filter((item) => {
                    return item.code === dt.status
                })

                toast.current.show({
                    severity: 'success',
                    summary: statusData[0].name,
                    detail: `Astrologer has been successfully ${statusData[0].name}`,
                    life: 3000
                });
                // console.log("statusData", dt)
            })
            .catch((error) => {
                console.log(error);
                toast.current.show({
                    severity: 'error',
                    summary: "Oops",
                    detail: `Something went wrong`,
                    life: 3000
                });
            });
    };

    // ====================== List of countries ========================//
    const getcountryList = async () => {
        await axios
            .get(`https://api.countrystatecity.in/v1/countries`, {
                headers: {
                    "X-CSCAPI-KEY": `NTZqT2JwckRHbDBPSVdhYUtHdHlLS2V0TEdobzVHcWE5eHBjS1k1eg==`,
                },
            })
            .then((res) => {
                const dt = res.data;
                const countryList = dt?.map((item) => {
                    return { name: item.name }
                })
                // console.log("countryList", dt)
                setCountryData(dt);
                setCountriesList(countryList);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // ====================== List of statse ===========================//
    const getstatelist = useCallback(async (country) => {
        await axios
            .get(`https://api.countrystatecity.in/v1/countries/${country}/states`, {
                headers: {
                    "X-CSCAPI-KEY": `NTZqT2JwckRHbDBPSVdhYUtHdHlLS2V0TEdobzVHcWE5eHBjS1k1eg==`,
                },
            })
            .then((res) => {
                const dt = res.data;
                const ndt = dt.sort((a, b) => {
                    const name1 = a.name.toUpperCase();
                    const name2 = b.name.toUpperCase();
                    if (name2 > name1) {
                        return -1;
                    }
                    if (name2 < name1) {
                        return 1;
                    }
                    return 0;
                });
                const stateList = ndt?.map((item) => {
                    return { name: item.name }
                })
                setStateData(ndt);
                // console.log("stateList", ndt, stateList)
                setStatesList(stateList)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // ======================= List of cities =======================//
    const getcitieslist = useCallback(async (state, country) => {
        await axios
            .get(
                `https://api.countrystatecity.in/v1/countries/${country}/states/${state}/cities`,
                {
                    headers: {
                        "X-CSCAPI-KEY": `NTZqT2JwckRHbDBPSVdhYUtHdHlLS2V0TEdobzVHcWE5eHBjS1k1eg==`,
                    },
                }
            )
            .then((res) => {
                setCitiesList(res.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // === show success message ==== ===
    const showSavedMessage = (severity, errMsg) => {
        toast.current.show({
            severity: severity == 'success' ? 'success' : 'error',
            summary: severity === 'success' ? "Saved" : "Oops",
            detail: severity === 'success' ? 'Astrologer data has been successfully saved' : errMsg.message,
            life: 3000
        });
    }

    // === show success message ==== ===
    const showAddMessage = (severity, errMsg) => {
        toast.current.show({
            severity: severity == 'success' ? 'success' : 'error',
            summary: severity === 'success' ? "Added" : "Oops",
            detail: severity === 'success' ? 'Astrologer has been successfully added' : errMsg.message,
            life: 3000
        });
    }
    // === show success message ==== ===
    const showUpdateMessage = (severity, errMsg) => {
        toast.current.show({
            severity: severity == 'success' ? 'success' : 'error',
            summary: severity === 'success' ? "Updated" : "Oops",
            detail: severity === 'success' ? 'Astrologer has been successfully updated' : errMsg.message,
            life: 3000
        });
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

    // ===== get image url to s3 ==== =====
    const getPreSignedUrl = async (data, flag) => {
        const url = flag === 1 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${selectedAstroData._id}/profile&content_type=image/jpeg` :
            flag === 2 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${selectedAstroData._id}&content_type=video/mp4` :
                flag === 3 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${selectedAstroData._id}/bank_document&content_type=image/jpeg` :
                    flag === 4 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${selectedAstroData._id}/aadhaar_front&content_type=image/jpeg` :
                        flag === 5 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${selectedAstroData._id}/aadhaar_back&content_type=image/jpeg` :
                            flag === 6 ? `${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${selectedAstroData._id}/pan_card&content_type=image/jpeg` :
                                "";
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
            // console.log('fileUploadRes', response);

            if (response.ok) {
                if (formMode === 2) {
                    flag === 1 ? addAstroImgFormik.setFieldValue("profileImage", urlData.url) :
                        flag === 2 ? addAstroImgFormik.setFieldValue("videoUrl", urlData.url) :
                            flag === 3 ? addAstroImgFormik.setFieldValue("chequePassbookPhoto", urlData.url) :
                                flag === 4 ? addAstroImgFormik.setFieldValue("aadhaarImg1", urlData.url) :
                                    flag === 5 ? addAstroImgFormik.setFieldValue("aadhaarImg2", urlData.url) :
                                        flag === 6 ? addAstroImgFormik.setFieldValue("panImg1", urlData.url) :
                                            "";
                }
                if (formMode !== 2) {
                    flag === 1 ? addAstroFormik.setFieldValue("profileImage", urlData.url) :
                        flag === 2 ? addAstroFormik.setFieldValue("videoUrl", urlData.url) :
                            flag === 3 ? addAstroFormik.setFieldValue("chequePassbookPhoto", urlData.url) :
                                flag === 4 ? addAstroFormik.setFieldValue("aadhaarImg1", urlData.url) :
                                    flag === 5 ? addAstroFormik.setFieldValue("aadhaarImg2", urlData.url) :
                                        flag === 6 ? addAstroFormik.setFieldValue("panImg1", urlData.url) :
                                            "";
                }
                showFileUploadMessage('success');
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

    // ===== get image url to s3 ==== =====
    const getThumbnailPreSignedUrl = async (data) => {
        const fileUrl = [];
        if (formMode === 2) {
            addAstroImgFormik.setFieldValue("thumbnailImage", fileUrl);
        }
        if (formMode !== 2) {
            addAstroFormik.setFieldValue("thumbnailImage", fileUrl);
        }
        // console.log("thumbnailImage", fileUrl);

        data.length !== 0 ? (
            data.map((item) => {
                const fileName = item.name.split('.');
                (
                    axios
                        .get(`${AppConstants.Api_BaseUrl}s3/pre-signed-url?key=astrologers/${selectedAstroData._id}/thumbnail_images/${fileName[0]}&content_type=image/jpeg`,
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
                            uploadThumbnailToS3(dt, item);
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

    const uploadThumbnailToS3 = async (urlData, fileVal) => {
        const url = urlData.signedUrl;

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
                showFileUploadMessage('success');
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

    const astroImgForm = () => {
        return (
            <form onSubmit={addAstroImgFormik.handleSubmit}>
                <div className='mx-3 mt-3'>
                    <div className="d-flex justify-content-between my-2 mx-4">
                        <div className="d-flex justify-content-between my-2 mx-4">
                            <p className="text-primary">
                                <CTooltip content='Back' position='left'>
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setFormMode(0);
                                            // addAstroFormik.resetForm();
                                            // setFilterDesignData(null);
                                        }}
                                    >
                                        <i className="pi pi-arrow-left mr-2"></i>
                                    </span>
                                </CTooltip>
                            </p>
                        </div>
                    </div>
                    <div className="row mx-3 mt-2">
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className='mt-3'>
                                <FileUpload
                                    id="profileImage"
                                    name="demo[]"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    chooseLabel="Profile"
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
                                    id="thumbnailImage"
                                    name="demo[]"
                                    multiple
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    chooseLabel="Thumbnail"
                                    customUpload
                                    uploadHandler={(e) => {
                                        const dataValue = e.files;
                                        // console.log("fileVal", dataValue);
                                        getThumbnailPreSignedUrl(dataValue);
                                    }}
                                    emptyTemplate={
                                        <p className="m-0">Drag and drop files to here to upload.</p>}
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
                                    chooseLabel="Video"
                                    customUpload
                                    uploadHandler={(e) => {
                                        const dataValue = e.files[0];
                                        // console.log("videoFileVal", e.files[0]);
                                        getPreSignedUrl(dataValue, 2);
                                    }}
                                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                                />
                            </span>
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className='mt-3'>
                                <FileUpload
                                    id="chequePassbookPhoto"
                                    name="demo[]"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    chooseLabel="Cheque/Passbook Photo"
                                    customUpload
                                    uploadHandler={(e) => {
                                        const dataValue = e.files[0];
                                        // console.log("fileVal", dataValue);
                                        getPreSignedUrl(dataValue, 3);
                                    }}
                                    // onSelect={customBase64UploaderThumbnailImage}
                                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                                />
                            </span>
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className='mt-3'>
                                <FileUpload
                                    id="aadhaarImg1"
                                    name="demo[]"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    chooseLabel="Adhar img 1"
                                    customUpload
                                    uploadHandler={(e) => {
                                        const dataValue = e.files[0];
                                        // console.log("fileVal", dataValue);
                                        getPreSignedUrl(dataValue, 4);
                                    }}
                                    emptyTemplate={
                                        <p className="m-0"> Drag and drop files to here to upload.</p>}
                                />
                            </span>
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className='mt-3'>
                                <FileUpload
                                    id="aadhaarImg2"
                                    name="demo[]"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    chooseLabel="Adhar img 2"
                                    customUpload
                                    uploadHandler={(e) => {
                                        const dataValue = e.files[0];
                                        // console.log("fileVal", dataValue);
                                        getPreSignedUrl(dataValue, 5);
                                    }}
                                    emptyTemplate={
                                        <p className="m-0">Drag and drop files to here to upload.</p>}
                                />
                            </span>
                        </div>
                        <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                            <span className='mt-3'>
                                <FileUpload
                                    id="panImg1"
                                    name="demo[]"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    chooseLabel="Pan imgage"
                                    customUpload
                                    uploadHandler={(e) => {
                                        const dataValue = e.files[0];
                                        // console.log("fileVal", dataValue);
                                        getPreSignedUrl(dataValue, 6);
                                    }}
                                    emptyTemplate={
                                        <p className="m-0">Drag and drop files to here to upload. </p>}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-end my-3 mx-4">
                        <Button
                            label="Save"
                            type="submit"
                            className="bg-primary border-0  p-button-md  btn-color p-button-raised"
                        // loading={loader === true ? true : false}
                        />
                        <Button
                            onClick={() => {
                                dispatch(setAstroViewMode(0));
                                addAstroImgFormik.resetForm();
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


    return (
        <div className='card'>
            <Toast ref={toast} />
            {formMode === 2 ? astroImgForm() :
                <form onSubmit={addAstroFormik.handleSubmit}>
                    <div className='mx-3 mt-3'>
                        <div className="d-flex justify-content-between mx-4">
                            <p className="text-primary">
                                <CTooltip content='Back' position='left'>
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            dispatch(setAstroViewMode(0));
                                            addAstroFormik.resetForm();
                                            // setFilterDesignData(null);
                                        }}
                                    >
                                        <i className="pi pi-arrow-left mr-2"></i>
                                    </span>
                                </CTooltip>
                            </p>
                            <div className="d-flex mr-1 align-items-center mt-1">
                                {/* <p className="para-publish my-1 mx-1">Status</p> */}
                                {viewMode === 2 ? "" :
                                    <span className="p-float-label">
                                        <Dropdown
                                            id="status"
                                            inputId="dropdown"
                                            options={statusList}
                                            value={addAstroFormik.values.status}
                                            onChange={(e) => {
                                                addAstroFormik.handleChange(e);
                                                updateStatus(e.value);
                                                // console.log("status", e.value);
                                            }}
                                            optionLabel="name"
                                            optionValue='code'
                                            className={
                                                (classNames({
                                                    "p-invalid": isAstroFormFieldValid("status"),
                                                }),
                                                    "p-inputtext-sm w-100 borderClass")
                                            }
                                        />
                                        {/* <label htmlFor="status">status</label> */}
                                    </span>}
                            </div>
                        </div>
                        <div className="row mx-3 mt-2">
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="fname"
                                        value={addAstroFormik.values.fname}
                                        onChange={addAstroFormik.handleChange}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("fname"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="fname">First name<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("fname")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="lname"
                                        value={addAstroFormik.values.lname}
                                        onChange={addAstroFormik.handleChange}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("lname"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="lname">Last name<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("lname")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="email"
                                        value={addAstroFormik.values.email}
                                        onChange={addAstroFormik.handleChange}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("email"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        disabled={viewMode === 3 ? true : false}
                                    />
                                    <label htmlFor="email">Email Id<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("email")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="mobile"
                                        value={addAstroFormik.values.mobile}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            const val = e?.target?.value?.replace(/[^\d]/g, "");
                                            // console.log("numVal",  val)
                                            addAstroFormik.setFieldValue('mobile', val);
                                        }}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("mobile"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        disabled={viewMode === 3 ? true : false}
                                    />
                                    <label htmlFor="mobile">Mobile No.<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("mobile")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <Calendar
                                        id="dob"
                                        yearNavigator
                                        yearRange={`1925:${maxYear}`}
                                        // showButtonBar
                                        value={addAstroFormik.values.dob}
                                        onChange={addAstroFormik.handleChange}
                                        dateFormat="d M, yy"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("dob"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="dob">DOB<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("dob")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="experience"
                                        inputId="dropdown"
                                        options={experienceList}
                                        value={addAstroFormik.values.experience}
                                        onChange={addAstroFormik.handleChange}
                                        optionLabel="name"
                                        optionValue='id'
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("experience"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="experience">Experience<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("experience")}
                            </div>
                        </div>
                        {viewMode === 3 ?
                            <div className="row mx-3 mt-2">
                                <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                                    <span className='mt-3'>
                                        <FileUpload
                                            id="profileImage"
                                            name="demo[]"
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            chooseLabel="Profile"
                                            customUpload
                                            uploadHandler={(e) => {
                                                const dataValue = e.files[0];
                                                // console.log("fileVal", dataValue);
                                                getPreSignedUrl(dataValue, 1);
                                            }}
                                            emptyTemplate={<p className="m-0">{selectedAstroData.profile_image !== undefined ? <img width={50} src={selectedAstroData.profile_image} alt={"img"} /> : "Drag and drop files to here to upload."}</p>}
                                        />
                                    </span>
                                </div>
                                <div className=" col-sm-12 col-md-6 col-lg-6 border rounded mt-4">
                                    <span className='mt-3 '>
                                        <FileUpload
                                            id="thumbnailImage"
                                            name="demo[]"
                                            multiple
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            chooseLabel="Thumbnail"
                                            customUpload
                                            uploadHandler={(e) => {
                                                const dataValue = e.files;
                                                // console.log("fileVal", dataValue);
                                                getThumbnailPreSignedUrl(dataValue);
                                            }}
                                            emptyTemplate={<p className="m-0"> Drag and drop files to here to upload </p>}
                                        />
                                        <div className='d-flex'>
                                            {thumbNailImg !== undefined ?
                                                thumbNailImg && thumbNailImg.map((item) => {

                                                    return (
                                                        <div className='my-2 mx-1 border rounded'>
                                                            <img width={50} src={item} alt={"img"} className='mx-2 my-2' />
                                                            <CTooltip content='Remove' position='top'>
                                                                <span
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => {
                                                                        const filterArray = thumbNailImg.filter(filterItem => filterItem !== item);
                                                                        setThumbNailImg(filterArray);
                                                                        // console.log("imgInfo", filterArray);
                                                                    }}
                                                                >
                                                                    <i className="pi pi-times"></i>
                                                                </span>
                                                            </CTooltip>
                                                        </div>
                                                    )
                                                })
                                                : ""}
                                        </div>
                                    </span>
                                </div>
                                <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                                    <span className='mt-3'>
                                        <FileUpload
                                            id="videoUrl"
                                            name="demo[]"
                                            accept="video/*"
                                            maxFileSize={5000000}
                                            chooseLabel="Video"
                                            customUpload
                                            uploadHandler={(e) => {
                                                const dataValue = e.files[0];
                                                // console.log("videoFileVal", e.files[0]);
                                                getPreSignedUrl(dataValue, 2);
                                            }}
                                            emptyTemplate={<p className="m-0">{selectedAstroData.video_url !== undefined ?
                                                <video controls width={100}>
                                                    <source src={selectedAstroData.video_url} type="video/mp4" />
                                                    Sorry, your browser doesn't support embedded videos.
                                                </video>
                                                : 'Drag and drop files to here to upload.'}</p>}
                                        />
                                    </span>
                                </div>
                            </div> : ""}
                        <div className="row mx-3 mt-2">
                            <p className="text-primary mt-3">Professional Information</p>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-4">
                                <div className='d-flex row'>
                                    <div className="col-sm-12 col-md-6 col-lg-6 d-flex mt-3">
                                        <Checkbox
                                            id="availableForChat"
                                            inputId="binary"
                                            checked={addAstroFormik.values.availableForChat}
                                            // value={addAstroFormik.values.availableForChat}
                                            onChange={addAstroFormik.handleChange}
                                        />
                                        <label htmlFor="binary mx-1">Available For Chat</label>
                                    </div>
                                    {addAstroFormik.values.availableForChat === true ?
                                        <div className="col-sm-12 col-md-6 col-lg-6">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    id="chatPrice"
                                                    value={addAstroFormik.values.chatPrice}
                                                    onValueChange={addAstroFormik.handleChange}
                                                    className={
                                                        (classNames({
                                                            "p-invalid": isAstroFormFieldValid("chatPrice"),
                                                        }),
                                                            "p-inputtext-sm w-100 borderClass")
                                                    }
                                                />
                                                <label htmlFor="chatPrice">Chat Price<span className='text-danger'>*</span></label>
                                            </span>
                                            {getAstroFormErrorMessage("chatPrice")}
                                        </div> : ""}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mt-4">
                                <div className='d-flex row'>
                                    <div className="col-sm-12 col-md-6 col-lg-6 d-flex mt-2">
                                        <Checkbox
                                            id="availableForCall"
                                            inputId="binary"
                                            checked={addAstroFormik.values.availableForCall}
                                            onChange={addAstroFormik.handleChange}
                                        />
                                        <label htmlFor="binary mx-1">Available For Call</label>
                                    </div>
                                    {addAstroFormik.values.availableForCall === true ?
                                        <div className="col-sm-12 col-md-6 col-lg-6">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    id="callPrice"
                                                    value={addAstroFormik.values.callPrice}
                                                    onValueChange={addAstroFormik.handleChange}
                                                    className={
                                                        (classNames({
                                                            "p-invalid": isAstroFormFieldValid("callPrice"),
                                                        }),
                                                            "p-inputtext-sm w-100 borderClass")
                                                    }
                                                />
                                                <label htmlFor="callPrice">Call Price<span className='text-danger'>*</span></label>
                                            </span>
                                            {getAstroFormErrorMessage("callPrice")}
                                        </div> : ""}
                                </div>
                            </div>
                        </div>
                        <div className="row mx-3 mt-2">
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="country"
                                        inputId="dropdown"
                                        options={countriesList}
                                        value={addAstroFormik.values.country}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            const filterCountry = countryData && countryData.filter((item) => {
                                                return e.value === item.name
                                            })
                                            getstatelist(filterCountry && filterCountry[0].iso2);
                                            // console.log("country", e.value, filterCountry)
                                        }}
                                        optionLabel="name"
                                        optionValue="name"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("country"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        display="chip"
                                    />
                                    <label htmlFor="country">Country<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("country")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="state"
                                        inputId="dropdown"
                                        options={statesList}
                                        value={addAstroFormik.values.state}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            const filterCountry = countryData && countryData.filter((item) => {
                                                return addAstroFormik.values.country === item.name
                                            })
                                            const filterState = stateData && stateData.filter((item) => {
                                                return e.value === item.name
                                            })
                                            // console.log("state", e.value)s
                                            getcitieslist(filterState[0].iso2, filterCountry[0].iso2);
                                        }}
                                        optionLabel="name"
                                        optionValue="name"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("state"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        display="chip"
                                    />
                                    <label htmlFor="state">State<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("state")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="city"
                                        inputId="dropdown"
                                        options={citiesList}
                                        value={addAstroFormik.values.city}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            // console.log("city", e.value)
                                        }}
                                        optionLabel="name"
                                        optionValue="name"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("city"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        display="chip"
                                    />
                                    <label htmlFor="city">City<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("city")}
                            </div>
                        </div>
                        <div className="row mx-3 mt-2">
                            <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="pinCode"
                                        value={addAstroFormik.values.pinCode}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            const val = e?.target?.value?.replace(/[^\d]/g, "");
                                            // console.log("numVal",  val)
                                            addAstroFormik.setFieldValue('pinCode', val);
                                        }}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("pinCode"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="pinCode">Pin Code<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("pinCode")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <MultiSelect
                                        id="language"
                                        inputId="multiselect"
                                        options={languageList}
                                        value={addAstroFormik.values.language}
                                        onChange={addAstroFormik.handleChange}
                                        optionLabel="name"
                                        optionValue="code"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("language"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        display="chip"
                                    />
                                    <label htmlFor="language">Language<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("language")}
                            </div>
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="gender"
                                        inputId="dropdown"
                                        options={genderList}
                                        value={addAstroFormik.values.gender}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            // console.log("gender", e.value)
                                        }}
                                        optionLabel="name"
                                        optionValue="code"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("gender"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        disabled={viewMode === 3 ? true : false}
                                    />
                                    <label htmlFor="gender">Gender<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("gender")}
                            </div>
                        </div>
                        <div className="row mx-3 mt-2">
                            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                                <span className="p-float-label">
                                    <MultiSelect
                                        id="specialization"
                                        inputId="multiselect"
                                        options={specializationList}
                                        value={addAstroFormik.values.specialization}
                                        onChange={addAstroFormik.handleChange}
                                        optionLabel="name"
                                        optionValue="code"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("specialization"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        display="chip"
                                    />
                                    <label htmlFor="multiselect">Specialization</label>
                                </span>
                                {getAstroFormErrorMessage("specialization")}
                            </div>
                            <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                                <span className="p-float-label">
                                    <MultiSelect
                                        id='skills'
                                        inputId="multiselect"
                                        options={skillList}
                                        value={addAstroFormik.values.skills}
                                        onChange={addAstroFormik.handleChange}
                                        optionLabel="name"
                                        optionValue="code"
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("skills"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                        display="chip"
                                    />
                                    <label htmlFor="multiselect">Skills</label>
                                </span>
                                {getAstroFormErrorMessage("skills")}
                            </div>
                        </div>
                        <div className="row mx-3 mt-2">
                            <div className=" col-sm-12 col-md-12 col-lg-12 mt-4">
                                <span className="p-float-label">
                                    <InputTextarea
                                        id="description"
                                        value={addAstroFormik.values.description}
                                        onChange={addAstroFormik.handleChange}
                                        rows={3}
                                        cols={30}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("description"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="description">Description<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("description")}
                            </div>
                        </div>
                        <div className="row mx-3 mt-2">
                            <p className="text-primary mt-3">Bank Details</p>
                            <div className=" col-sm-12 col-md-3 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="bankName"
                                        value={addAstroFormik.values.bankName}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            const val = e?.target?.value?.replace(/\d/g, '');
                                            addAstroFormik.setFieldValue('bankName', val)
                                        }}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("bankName"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="bankName">Bank Name<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("bankName")}
                            </div>
                            <div className=" col-sm-12 col-md-3 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="accountNumber"
                                        value={addAstroFormik.values.accountNumber}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            const val = e?.target?.value?.replace(/[^\d]/g, "");
                                            // console.log("numVal",  val)
                                            addAstroFormik.setFieldValue('accountNumber', val);
                                        }}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("accountNumber"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="accountNumber">Account No.<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("accountNumber")}
                            </div>
                            <div className=" col-sm-12 col-md-3 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="ifscCode"
                                        value={addAstroFormik.values.ifscCode}
                                        onChange={addAstroFormik.handleChange}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("ifscCode"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="ifscCode">IFSC Code<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("ifscCode")}
                            </div>
                            <div className=" col-sm-12 col-md-3 col-lg-3 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="upiId"
                                        value={addAstroFormik.values.upiId}
                                        onChange={addAstroFormik.handleChange}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("upiId"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="upiId">UPI ID</label>
                                </span>
                                {getAstroFormErrorMessage("upiId")}
                            </div>
                            {viewMode === 3 ?
                                <div className=" col-sm-12 col-md-9 col-lg-9 mt-4">
                                    <span className='mt-3'>
                                        <FileUpload
                                            id="chequePassbookPhoto"
                                            name="demo[]"
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            chooseLabel="Cheque/Passbook Photo"
                                            customUpload
                                            uploadHandler={(e) => {
                                                const dataValue = e.files[0];
                                                // console.log("fileVal", dataValue);
                                                getPreSignedUrl(dataValue, 3);
                                            }}
                                            // onSelect={customBase64UploaderThumbnailImage}
                                            emptyTemplate={<p className="m-0">{selectedAstroData.bank_info.bank_document_image !== undefined ? <img width={50} src={selectedAstroData.bank_info.bank_document_image} alt={"img"} /> : "Drag and drop files to here to upload."}</p>}
                                        />
                                    </span>
                                </div> : ""}
                        </div>
                        <div className="row mx-3 mt-2">
                            <p className="text-primary mt-3">KYC</p>
                            <div className=" col-sm-12 col-md-3 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="aadhaarNumber"
                                        value={addAstroFormik.values.aadhaarNumber}
                                        onChange={(e) => {
                                            addAstroFormik.handleChange(e);
                                            const val = e?.target?.value?.replace(/[^\d]/g, "");
                                            // console.log("numVal",  val)
                                            addAstroFormik.setFieldValue('aadhaarNumber', val);
                                        }}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("aadhaarNumber"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="aadhaarNumber">Aadhaar/Voter Id/Passport/DL No.<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("aadhaarNumber")}
                            </div>
                        </div>
                        {viewMode === 3 ?
                            <div className="row mx-3 mt-2">
                                <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                                    <span className='mt-3'>
                                        <FileUpload
                                            id="aadhaarImg1"
                                            name="demo[]"
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            chooseLabel="Adhar img 1"
                                            customUpload
                                            uploadHandler={(e) => {
                                                const dataValue = e.files[0];
                                                // console.log("fileVal", dataValue);
                                                getPreSignedUrl(dataValue, 4);
                                            }}
                                            emptyTemplate={
                                                <p className="m-0">
                                                    {selectedAstroData?.kyc?.aadhaar_images[0]?.document_url !== undefined ? <img width={50} src={selectedAstroData?.kyc?.aadhaar_images[0]?.document_url} alt={"img"} /> : "Drag and drop files to here to upload."}
                                                </p>}
                                        />
                                    </span>
                                </div>
                                <div className=" col-sm-12 col-md-6 col-lg-6 mt-4">
                                    <span className='mt-3'>
                                        <FileUpload
                                            id="aadhaarImg2"
                                            name="demo[]"
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            chooseLabel="Adhar img 2"
                                            customUpload
                                            uploadHandler={(e) => {
                                                const dataValue = e.files[0];
                                                // console.log("fileVal", dataValue);
                                                getPreSignedUrl(dataValue, 5);
                                            }}
                                            emptyTemplate={
                                                <p className="m-0">
                                                    {selectedAstroData?.kyc?.aadhaar_images[1]?.document_url !== undefined ? <img width={50} src={selectedAstroData?.kyc?.aadhaar_images[1]?.document_url} alt={"img"} /> : "Drag and drop files to here to upload."}
                                                </p>}
                                        />
                                    </span>
                                </div>
                            </div> : ""}
                        <div className="row mx-3 mt-2">
                            <div className=" col-sm-12 col-md-4 col-lg-4 mt-4">
                                <span className="p-float-label">
                                    <InputText
                                        id="panNumber"
                                        value={addAstroFormik.values.panNumber}
                                        onChange={addAstroFormik.handleChange}
                                        className={
                                            (classNames({
                                                "p-invalid": isAstroFormFieldValid("panNumber"),
                                            }),
                                                "p-inputtext-sm w-100 borderClass")
                                        }
                                    />
                                    <label htmlFor="panNumber">Pan Card No.<span className='text-danger'>*</span></label>
                                </span>
                                {getAstroFormErrorMessage("panNumber")}
                            </div>
                            {viewMode === 3 ?
                                <div className=" col-sm-12 col-md-8 col-lg-8 mt-4">
                                    <span className='mt-3'>
                                        <FileUpload
                                            id="panImg1"
                                            name="demo[]"
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            chooseLabel="Pan imgage"
                                            customUpload
                                            uploadHandler={(e) => {
                                                const dataValue = e.files[0];
                                                // console.log("fileVal", dataValue);
                                                getPreSignedUrl(dataValue, 6);
                                            }}
                                            emptyTemplate={
                                                <p className="m-0">
                                                    {selectedAstroData?.kyc?.pan_card_image !== undefined ? <img width={50} src={selectedAstroData?.kyc?.pan_card_image} alt={"img"} /> : "Drag and drop files to here to upload."}
                                                </p>}
                                        />
                                    </span>
                                </div> : ""}
                        </div>
                        <div className="modal-footer d-flex justify-content-end my-3 mx-4">
                            <Button
                                label={viewMode === 2 ? "Save and Next" : "Update"}
                                type="submit"
                                className="bg-primary border-0  p-button-md  btn-color p-button-raised"
                                loading={loader === true ? true : false}
                            />
                            <Button
                                onClick={() => {
                                    dispatch(setAstroViewMode(0));
                                    addAstroFormik.resetForm();
                                }}
                                label={"Cancel"}
                                style={{ marginLeft: "10px" }}
                                className="bg-danger border-0 p-button-md p-button-raised"
                            />
                        </div>
                    </div>
                </form>}
        </div>
    )
}

export default AstroAddUpdateForm
