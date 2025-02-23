import React, { useState } from "react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useSupabase } from "./SupabaseContext";
import { v4 } from "uuid";
import QRCode from 'qrcode'

function App() {
    const supabase = useSupabase();
    const [fileUpload, setFileUpload] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [qr, setQr] = useState();

    const uploadFile = async () => {
        if (!fileUpload) {
            setErrorMessage("select a file to upload");
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

            console.log("Upload successful =>", id);
            generateQR(id)
        } catch (error) {
            console.error("Error during upload:", error);
            setErrorMessage(error.message);
        } finally {
            setUploading(false);
        }
    };

    const generateQR = async (text) => {
        try {
            const code = await QRCode.toDataURL(text);
            setQr(code)
            console.log(code)

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>  
            <h1>Upload</h1>
            <div
                id="drag-drop-area"
                style={{ border: "1px solid #ccc", padding: "20px" }}
            ></div>

            <input
                type="file"
                onChange={(event) => setFileUpload(event.target.files[0])}
            ></input>

            {uploading && <div>Uploading...</div>}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

            <button onClick={uploadFile} disabled={uploading}>
                Upload
            </button>

            {qr}
        </div>
    );
}

export default App;
