import NavbarLinks from "./NavbarLinks.jsx";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import { IoClose } from "react-icons/io5";
import Button from "../Button.jsx";

const MobileNav = ({ isOpen, onClose }) => {
  const { width } = useWindowSize();

  if (width >= 768 || !isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-screen w-full backdrop-blur-sm text-white z-50 flex flex-col items-center justify-center gap-8">
      <IoClose onClick={onClose} className="absolute top-6 right-3.5 size-12" />
      <NavbarLinks onClick={onClose} />
      <Button
        to="/vendor-application"
        onClick={onClose}
        children="List now"
        className="md:hidden text-xl px-6"
      />
    </div>
  );
};

export default MobileNav;
