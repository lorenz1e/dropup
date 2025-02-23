import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSupabase } from "./SupabaseContext";

export const Download = () => {
  const supabase = useSupabase();
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [matchingFile, setMatchingFile] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("data_ids").select();

        if (error) throw new Error(error.message);

        const match = data.findIndex((file) => file.file_id === id);
        setMatchingFile(data[match]);

        if (match < 0) {
          navigate("/");
        }
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <h1>Download</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>Loading...</p> : <p>File: {matchingFile.name}</p>}
    </div>
  );
};
