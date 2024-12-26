import { Link } from "react-router-dom";

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavigationLink = ({ to, children, onClick }: NavigationLinkProps) => (
  <Link
    to={to}
    className="transition-colors duration-300 hover:text-[#F5A623] px-3 py-2 rounded-md"
    onClick={onClick}
  >
    {children}
  </Link>
);

export const NavigationLinks = ({ onClickMobile }: { onClickMobile?: () => void }) => {
  const links = [
    { to: "/top-memes", text: "Top Memes" },
    { to: "/my-story", text: "My Story" },
    { to: "/my-memes", text: "My Memes" },
    { to: "/watchlist", text: "Watchlist" },
    { to: "/tuzemoon", text: "Tuzemoon" },
  ];

  return (
    <>
      {links.map((link) => (
        <NavigationLink key={link.to} to={link.to} onClick={onClickMobile}>
          {link.text}
        </NavigationLink>
      ))}
    </>
  );
};