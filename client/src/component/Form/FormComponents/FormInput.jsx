import React from "react";

const FormInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  autocomplete,
  error,
  hasError = true,
  hasLabel = true,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-2 w-full">
      <label className={`${!hasLabel ? "hidden" : ""}`} htmlFor={name}>
        {placeholder}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        autoComplete={autocomplete}
        onChange={onChange}
        className={`inputCap w-full p-3 rounded bg-black border border-gray-700 text-white focus:outline-none focus:border-amber-400 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {hasError && (
        <div className="h-4">
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default FormInput;
