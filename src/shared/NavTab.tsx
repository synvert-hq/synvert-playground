import { NavLink } from "react-router-dom";

interface NavTabProps {
  text: string;
  link: string;
}

export const NavTab: React.FC<NavTabProps> = ({ text, link }) => {
  return (
    <NavLink
      className={({ isActive }) =>
        "mx-2 px-4 py-3 " + (isActive ? "rounded-md bg-gray-900" : "")
      }
      to={link}
    >
      {text}
    </NavLink>
  );
};

export default NavTab;
