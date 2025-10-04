import { useState } from "react";
import { IoClose } from "react-icons/io5";
import FormTitle from "./FormComponents/FormTitle.jsx";
import FormInput from "./FormComponents/FormInput.jsx";
import Button from "../Button.jsx";
import FormSubtext from "./FormComponents/FormSubtext.jsx";

const SignupForm = ({
  onSubmit,
  onClose,
  onChange,
  signupForm,
  setIsLoginForm,
  setSignupForm,
  errors,
  setErrors,
  loading,
}) => {
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      nextStep();
    } else {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form top-5">
      <IoClose
        onClick={onClose}
        className="relative top-0 right-0 size-7 hover:cursor-pointer"
      />

      <FormTitle text="Sign up" />
      {errors.general && (
        <div className="text-red-500 text-sm mb-2">{errors.general}</div>
      )}

      {step === 1 && (
        <>
          <div className="flex items-center justify-between gap-2">
            <FormInput
              type="text"
              name="firstName"
              placeholder="First Name"
              value={signupForm.firstName}
              autocomplete="given-name"
              onChange={onChange}
              error={errors.firstName}
            />
            <FormInput
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={signupForm.lastName}
              autocomplete="family-name"
              onChange={onChange}
              error={errors.lastName}
            />
          </div>

          <FormInput
            type="text"
            name="otherNames"
            placeholder="Other Names"
            value={signupForm.otherNames}
            autocomplete="additional-name"
            onChange={onChange}
          />

          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            value={signupForm.email}
            autocomplete="email"
            onChange={onChange}
            error={errors.email}
          />

          <FormInput
            type="tel"
            name="tel"
            placeholder="Phone Number"
            value={signupForm.tel}
            autocomplete="tel"
            onChange={onChange}
            error={errors.tel}
          />
        </>
      )}

      {step === 2 && (
        <>
          <FormInput
            type="text"
            name="address"
            placeholder="Address"
            value={signupForm.address}
            autocomplete="street-address"
            onChange={onChange}
            error={errors.address}
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            value={signupForm.password}
            autocomplete="new-password"
            onChange={onChange}
            error={errors.password}
          />

          <FormInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={signupForm.confirmPassword}
            autocomplete="new-password"
            onChange={onChange}
            error={errors.confirmPassword}
          />
        </>
      )}

      <div className="flex justify-between mt-4 gap-4">
        {step > 1 && (
          <Button type="button" onClick={prevStep} className="w-1/2">
            Back
          </Button>
        )}
        <Button
          type="submit"
          className={step > 1 ? "w-1/2" : "w-full"}
          disabled={loading}
        >
          {loading ? "Submitting..." : step === 1 ? "Next" : "Signup"}
        </Button>
      </div>

      <FormSubtext
        text="Already have an account?"
        link="Login"
        onClick={() => {
          setIsLoginForm(true);
          setSignupForm({
            firstName: "",
            lastName: "",
            otherNames: "",
            tel: "",
            email: "",
            address: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({
            firstName: "",
            lastName: "",
            tel: "",
            email: "",
            address: "",
            password: "",
            confirmPassword: "",
            general: "",
          });
        }}
      />
      <hr />
    </form>
  );
};

export default SignupForm;
