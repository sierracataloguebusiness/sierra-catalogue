import React from "react";

const PageFlyer = ({ heading, subheading, size }) => {
  return (
    <div
      className={`relative px-4 min-h-[85vh] bg-[url('/assets/bg-sec.jpg')] bg-cover bg-center flex flex-col gap-6 justify-center items-center text-white`}
    >
      <div className="relative flex flex-col gap-4 md:w-3/4 mx-auto text-center">
        <h2 className="heading md:heading-large">{heading}</h2>
        <p className="text-lg">{subheading}</p>
      </div>
    </div>
  );
};
export default PageFlyer;
