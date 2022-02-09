import { createContext, useState } from "react";

export const emailContext = createContext();

export const EmailProvider = (props) => {
  const [email, setEmail] = useState("");

  const value = {
    email,
    setEmail,
  };

  return (
    <emailContext.Provider value={value}>
      {props.children}
    </emailContext.Provider>
  );
};
