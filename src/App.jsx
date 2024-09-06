import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import "./App.css";
import TransactionForm from "./components/TransactionForm";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Index from "./components/Index";
import Graph from "./components/Graph";
import Report from "./components/Report";

function App() {
  return (
    <>
      <Tabs
        defaultActiveKey="TransactionForm"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="TransactionForm" title="Transaction Form">
          <TransactionForm />
        </Tab>
        <Tab eventKey="List" title="List">
          <Index />
        </Tab>
        <Tab eventKey="กราฟจำนวนสมาชิกตามอายุ" title="กราฟจำนวนสมาชิกตามอายุ">
          <Graph />
        </Tab>
        <Tab
          eventKey="รายงานรายจำนวนสมาชิกตามอายุ"
          title="รายงานรายจำนวนสมาชิกตามอายุ"
        >
          <Report />
        </Tab>
      </Tabs>
    </>
  );
}

export default App;
