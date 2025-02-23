import { data, Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSupabase } from "./SupabaseContext";

export const Download = () => {
  const supabase = useSupabase();
  const { id } = useParams();
  const navigate = useNavigate();
  const [matchingFile, setMatchingFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadURL, setDownloadURL] = useState()

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("data_ids")
          .select()
          .eq("file_id", id)
          .single();

        if (!data) {
          navigate("/");
        }

        if (error) throw new Error(error.message);

        setMatchingFile(data);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [id, supabase, navigate]);

  useEffect(() => {
    if (matchingFile) {
      const { data } = supabase.storage
        .from("data")
        .getPublicUrl(matchingFile.file_id, {download: matchingFile.name});

      setDownloadURL(data.publicUrl)
      console.log(downloadURL);
    }
  }, [matchingFile]);

  return (
    <div>
      <h1>Download</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : matchingFile ? (
        <>
          <p>File: {matchingFile.name}</p>
          <button onClick={() => window.open(downloadURL)}>Download</button>
        </>
      ) : (
        <p>No file found.</p>
      )}
    </div>
  );
};
