import React from "react";
import { SimpleAuth } from "../site/SimpleAuth";

const Signup: React.FC = () => (
  <SimpleAuth
    title="Sign up"
    submit="Sign up"
    fields={[
      { label: "Username", autoComplete: "username" },
      { label: "Email", type: "email", autoComplete: "email" },
      { label: "Password", type: "password", autoComplete: "new-password" },
    ]}
  />
);

export default Signup;
