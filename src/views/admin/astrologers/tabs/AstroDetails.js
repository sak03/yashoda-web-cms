import { CTooltip } from '@coreui/react';
import { Avatar } from 'primereact/avatar';
import React from 'react'
import { formatDate } from '../../../../constants/constants';
import {
  FaPencilAlt,
  FaPhoneAlt,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTwitter,
  FaInstagram,
  FaFacebookSquare
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setAstroViewMode } from '../../../../redux/actions/astroViewModeAction';
import { Rating } from 'primereact/rating';
import { Divider } from 'primereact/divider';

const AstroDetails = () => {
  const selectedCandidate = null
  const dispatch = useDispatch();
  const selectedAstroData = useSelector((state) => state.selectedAstro);
  const category = selectedAstroData.category.map((item) => {
    return item.name
  });
  const languages = selectedAstroData.languages.map((item) => {
    return item.name
  });
  const specilization = selectedAstroData.specilization.map((item) => {
    return (
      <div className='col-sm-12 col-md-6 col-lg-3 shadow my-2'>
        <strong>{item.name}</strong>
        <div className=''>
          <img
            src={item.specilizationImage}
            width={150}
            height={150}
          />
        </div>
      </div>
    )
  })
  const skills = selectedAstroData.skills.map((item) => {
    return (
      <div className='col-sm-12 col-md-6 col-lg-3 shadow my-2'>
        <strong>{item.name}</strong>
        <div className=''>
          <img
            src={item.skillImage}
            width={150}
            height={150}
          />
        </div>
      </div>
    )
  })
  console.log("selectedAstroData", selectedAstroData)
  return (
    <div>
      <div className="row mx-2">
        <div className="col-sm-12 col-md-6 col-lg-7 d-flex">
          <div className="d-flex">
            <div className="mt-3 ml-2">
              {selectedAstroData.profileImage !== undefined ? (
                <img
                  src={selectedAstroData.profileImage}
                  width={125}
                  height={125}
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <Avatar
                  label={selectedAstroData.name[0].toUpperCase()}
                  className="mr-2"
                  size="xlarge"
                  shape="circle"
                  style={{ fontSize: "4rem", width: "6rem", height: "6rem" }}
                />
              )}
            </div>
            <div className="mx-3 mt-3">
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>
                  {selectedAstroData.name} &nbsp; <i className='text-muted'>({selectedAstroData?.title})</i>
                </strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                &nbsp;
                <a
                  href={selectedAstroData.linkedinLink}
                  target="blank"
                >
                  <FaLinkedin className="text-primary fs-5 rounded" />
                </a>
                &nbsp;
                <a
                  href={selectedAstroData.instagramLink}
                  target="blank"
                >
                  <FaInstagram className="text-danger fs-5 rounded" />
                </a>
                &nbsp;
                <a
                  href={selectedAstroData.twitterLink}
                  target="blank"
                >
                  <FaTwitter className="text-primary fs-5 rounded" />
                </a>
                &nbsp;
                <a
                  href={selectedAstroData.fbLink}
                  target="blank"
                >
                  <FaFacebookSquare className="text-primary fs-5 rounded" />
                </a>
                &nbsp;
                <CTooltip content="Update" placement="top">
                  <span style={{ cursor: "pointer" }}>
                    <FaPencilAlt
                      onClick={(e) => {
                        dispatch(setAstroViewMode(3))
                      }}
                    />
                  </span>
                </CTooltip>
              </div>
              <CTooltip content="Phone Number" placement="top">
                <p
                  style={{ marginBottom: "0.5rem" }}
                  className="d-flex align-items-center"
                >
                  <FaPhoneAlt className="text-success" />
                  <span>&nbsp; {selectedAstroData.phone}</span>
                </p>
              </CTooltip>
              <CTooltip content="Email Id" placement="top">
                <p
                  style={{ marginBottom: "0.5rem" }}
                  className="d-flex align-items-center"
                >
                  <FaEnvelope />
                  <span>&nbsp; {selectedAstroData.email}</span>
                </p>
              </CTooltip>
              <p className="d-flex align-items-center">
                <FaMapMarkerAlt className="text-danger" />
                <span>
                  &nbsp;
                  {selectedAstroData.fullAddress}
                </span>
              </p>
              <p className="d-flex align-items-center">
                <span>
                  <Rating
                    value={Math.ceil(selectedAstroData.rating)}
                    readOnly
                    stars={5}
                    cancel={false}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-5 ">
          <div
            className="d-flex align-items-center"
            style={{ marginBottom: "0.5rem " }}
          >
            <div className="d-flex align-items-center flex-fill">
              <span style={{ fontSize: "1.1rem" }}>Status: </span> &nbsp;
              {selectedAstroData.status === 1 ? <span className='text-success'>Active</span> : <span className='text-danger'>Inactive</span>}
            </div>
            <div className="d-flex align-items-center">
              <CTooltip content="Close" placement="top">
                <i
                  className="pi pi-times editBtn"
                  style={{
                    fontSize: "1.5em",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    dispatch(setAstroViewMode(0));
                  }}
                ></i>
              </CTooltip>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between" >
            <span>Call Price:&nbsp;{selectedAstroData.callPrice}</span>
            <span>Chat Price:&nbsp;{selectedAstroData.chatPrice}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between my-1">
            <span>
              Wallet Balance:{" "}
              <span className={selectedAstroData.walletBalance == 0 ? "text-danger" : "text-success"}>
                {selectedAstroData.walletBalance}
              </span>
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between" >
            <span>Min. Payout:&nbsp;{selectedAstroData.minPayout}</span>
            <span>Commision:&nbsp;{selectedAstroData.commision}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between my-1" >
            <span>Created Date:&nbsp;{formatDate(new Date(selectedAstroData.createdAt))}</span>
            <span>Updated Date:&nbsp;{formatDate(new Date(selectedAstroData.updatedAt))}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between my-1" >
            <span>Following:&nbsp;{selectedAstroData.following.length}</span>
            <span>Followers:&nbsp;{selectedAstroData.followers.length}</span>
          </div>
        </div>
      </div>
      <Divider />
      <div className="row mx-2">
        <div className='shadow-sm p-2'>{selectedAstroData.description}</div>
        <div className='my-1'><strong>Category</strong>:&nbsp;{category.join(", ")}</div>
        <div className='my-1'><strong>Languages</strong>:&nbsp;{languages.join(", ")}</div>
        <div className='my-1'><strong>Specilization</strong>:&nbsp;
          <div className='row'>{specilization}</div>
        </div>
        <div className='my-1'><strong>Skills</strong>:&nbsp;
          <div className='row'>{skills}</div>
        </div>
      </div>
    </div>
  )
}

export default AstroDetails