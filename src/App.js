import React from "react";
import Upload from "./components/Upload";
import { History } from "./components/History";
import logo from "./logo.svg";
import { UploadProvider } from "./UploadHistoryContext";

function App() {
  return (
    <div className="container">
      <img src={logo} className="logo"></img>

      <div className="content">
        <UploadProvider>
          <Upload></Upload>
          <History></History>
        </UploadProvider>
      </div>
    </div>
  );
}

export default App;
