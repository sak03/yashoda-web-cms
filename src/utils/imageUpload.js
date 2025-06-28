import axios from "axios";
import { AppConstants } from '../constants/constants'


export const getImageS3 = async (productId) => {
    await axios
        .get(`${AppConstants.Api_BaseUrl}pre-signed-url?key=products/${productId}&contentType=video/mp4`,
            {
                headers: {
                    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhlY2Y1OWMwZTVmNjJiM2ZkMWI4ZiIsImlhdCI6MTY2OTkxNzk0MX0.hWr6QfcSlsTWPOoEY4nLbFDmeGKLACewjacRMxuyQtE",
                    "Content-Type": "application/json",
                },
            })
        .then((res) => {
            const dt = res.data.data;
            uploadImageS3(dt.signedUrl, dt.url)
            console.log("signedUrlRes", dt);
        })
        .catch((err) => {
            console.log(err);
        })
}

const uploadImageS3 = async (signedUrl) => {
    const postData = img
    await axios
        .put(`${signedUrl}`, postData, {
            headers: {
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhlY2Y1OWMwZTVmNjJiM2ZkMWI4ZiIsImlhdCI6MTY2OTkxNzk0MX0.hWr6QfcSlsTWPOoEY4nLbFDmeGKLACewjacRMxuyQtE",
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            const dt = res.data;
            console.log("s3uploadImage", dt)
        })
        .catch((err) => {
            console.log(err)
        })
}

