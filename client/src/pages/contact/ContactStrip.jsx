import React from "react";

const ContactStrip = ({ heading, content }) => {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-primary-gold font-bold text-xl">{heading}</h3>
      <p className="font-light text-gray-400">{content}</p>
    </div>
  );
};
export default ContactStrip;
