import React from "react";

const ContactStripElement = ({ icon, to, content }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <a href={to} className="underline cursor-pointer">
        {content}
      </a>
    </div>
  );
};
export default ContactStripElement;
