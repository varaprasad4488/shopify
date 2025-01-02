import React from "react";
import { AppBridgeProvider } from "@shopify/app-bridge-react";
const appConfig = {
  apiKey: "69161c70ee81af9164e9634b2f9b7195", 
  host: new URLSearchParams(window.location.search).get("host"),
  forceRedirect: true,
};

const AppWrapper = ({ children }) => {
  return <AppBridgeProvider config={appConfig}>{children}</AppBridgeProvider>;
};

export default AppWrapper;