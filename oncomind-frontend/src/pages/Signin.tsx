import React from "react";
import { SimpleAuth } from "../site/SimpleAuth";

const Signin: React.FC = () => (
  <SimpleAuth
    title="Sign in"
    submit="Sign in"
    fields={[
      { label: "Username", autoComplete: "username" },
      { label: "Password", type: "password", autoComplete: "current-password" },
    ]}
  />
);

export default Signin;
