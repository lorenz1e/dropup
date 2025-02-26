import React from "react";
import { HistoryItem } from "./HistoryItem";
import { useUpload } from "../UploadHistoryContext";

export const History = () => {
  const { uploadHistory } = useUpload();

  return (
    <div className="historyContainer">
      <div className="historyHeadline">History</div>
      {uploadHistory == ""  ? (
        <div>You have nothing uploaded in the past :/</div>
      ) : (
        uploadHistory?.map((item, index) => {
          return <HistoryItem key={item.id} item={item}></HistoryItem>;
        })
      )}
    </div>
  );
};
