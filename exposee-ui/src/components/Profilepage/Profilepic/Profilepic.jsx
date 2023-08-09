import React, { useRef } from "react";

const ProfilePictureUpload = ({ onUpload }) => {
    const fileInputRef = useRef(null);

    const handleUpload = (event) => {
        const formData = new FormData();
        formData.append("profilePicture", event.target.files[0]);
        onUpload(formData);
    };

    const handleChooseFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="profile-pic-upload">
            <label htmlFor="profilePicture">Upload Profile Picture</label>
            <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
            />
            <button className="upload-button" onClick={handleChooseFileClick}>
                Choose File
            </button>
        </div>
    );
};

export default ProfilePictureUpload;
