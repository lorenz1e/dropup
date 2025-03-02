import React from "react";

export const HistoryItem = (item) => {

  return (
    <div className="historyItemContainer" onClick={() => window.open(item.item.id)}>
      <div className="historyItemHeadline">{item.item.fileName}</div>
      <div>{item.item.date}</div>
    </div>
  );
};
