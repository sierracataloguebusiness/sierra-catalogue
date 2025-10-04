import React from "react";

const FormSubtext = ({ text, link, onClick }) => {
  return (
    <p className="text-center text-gray-400 my-4">
      {text}
      {"  "}
      <span
        onClick={onClick}
        className="text-amber-400 hover:underline hover:cursor-pointer"
      >
        {link}
      </span>
    </p>
  );
};
export default FormSubtext;
