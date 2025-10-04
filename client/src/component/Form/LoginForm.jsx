import { IoClose } from "react-icons/io5";
import FormTitle from "./FormComponents/FormTitle.jsx";
import FormInput from "./FormComponents/FormInput.jsx";
import Button from "../Button.jsx";
import FormSubtext from "./FormComponents/FormSubtext.jsx";

const LoginForm = ({
  onSubmit,
  onClose,
  onChange,
  loginForm,
  setIsLoginForm,
  setLoginForm,
  errors,
  setErrors,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="form">
      <IoClose
        onClick={onClose}
        className="relative top-0 right-0 size-7 hover:cursor-pointer"
      />

      <FormTitle text={"Login to Sierra Catalogue"} />

      {errors.general && (
        <div className="text-red-500 text-sm mb-2">{errors.general}</div>
      )}

      <FormInput
        type="email"
        name="email"
        placeholder="Email"
        value={loginForm.email}
        autocomplete="email"
        onChange={onChange}
        error={errors.email}
      />

      <FormInput
        type="password"
        name="password"
        placeholder="Password"
        value={loginForm.password}
        autocomplete="current-password"
        onChange={onChange}
        error={errors.password}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      <FormSubtext
        text="Don’t have an account?"
        link="Register"
        onClick={() => {
          setIsLoginForm(false);
          setLoginForm({ email: "", password: "" });
          setErrors({ email: "", password: "", general: "" });
        }}
      />

      <hr />
    </form>
  );
};

export default LoginForm;
