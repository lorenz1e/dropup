import React, { useState, useEffect } from "react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useSupabase } from "../SupabaseContext";
import { v4 } from "uuid";
import QRCode from "react-qr-code";
import { FiUploadCloud } from "react-icons/fi";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import { useUpload } from "../UploadHistoryContext";

function Upload() {
  const ip = "http://172.20.10.2:3001";

  const {addUpload} = useUpload();
  const supabase = useSupabase();
  const [fileUpload, setFileUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [id, setID] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (fileUpload) {
      uploadFile();
    }
  }, [fileUpload]);

  const uploadFile = async () => {
    if (!fileUpload) {
      setErrorMessage("Select a file to upload");
      return;
    }

    const id = v4();
    setUploading(true);
    setErrorMessage("");

    try {
      const { error: storageError } = await supabase.storage
        .from("data")
        .upload(id, fileUpload);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("data_ids")
        .insert({ name: fileUpload.name, file_id: id });

      if (dbError) throw dbError;

      setID(id);
      setUploadComplete(true);
      addUpload(id, fileUpload.name);

    } catch (error) {
      setUploadComplete(false);
      console.log(error.message)
    } finally {
      setUploading(false);
    }
  };


  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      setFileUpload(file);
    }
  };

  if (uploading) {
    return (
      <div className="uploadContainer">
        <Spinner />
        <div>
          Uploading...
          <div className="uploadingSubText">this might take a while</div>
        </div>
      </div>
    );
  } else if (uploadComplete && id) {
    return <QRCode value={`${ip}/${id}`} className="qrCode" />;
  }

  return (
    <>
      <label
        className={`uploadContainer ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUploadCloud className="uploadIcon" />

        <div>Drag & Drop files here or click to select</div>

        <div className="selectFileButton">Select files</div>

        <input
          type="file"
          onChange={(event) => setFileUpload(event.target.files[0])}
        />
      </label>
      {errorMessage && <div className="errorMsg">Error: {errorMessage}</div>}
    </>
  );
}

export default Upload;
