import { motion } from "framer-motion";
import { Menu, House, TicketPercent } from "lucide-react";
import { useEffect, useState, FC } from "react";

// Define types for Sidebar props
interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setSelectedOption: (option: string) => void;
  selectedOption: string;
}

// Define types for SidebarLink props
interface SidebarLinkProps {
  icon: JSX.Element;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

// SidebarLink Component
const SidebarLink: FC<SidebarLinkProps> = ({ icon, label, isCollapsed, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 w-full cursor-pointer transition duration-300
        ${isActive ? "text-primary-700" : "text-gray-500"}
        ${isCollapsed ? "justify-center" : "pl-4"}
      `}
    >
      <div
        className={`flex items-center gap-3 p-2 transition-all duration-300
          ${isActive ? "bg-primary-100 text-primary-700 rounded-full" : "hover:bg-primary-50"}
          ${isCollapsed ? "rounded-full" : "rounded-full pl-3 pr-6"}
        `}
      >
        <div>{icon}</div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar: FC<SidebarProps> = ({ isCollapsed, toggleSidebar, setSelectedOption, selectedOption }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(isCollapsed);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setCollapsed(mobileView ? false : isCollapsed);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isCollapsed]);

  return (
    <motion.aside
      initial={{ width: collapsed ? 60 : 250 }}
      animate={{ width: collapsed ? 60 : 250 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white  p-4 flex flex-col items-start mb-4 lg:mb-0 rounded-xl ml-3 lg:ml-0
        ${collapsed ? "w-16 items-center shadow-lg" : "w-64"}
      `}
    >
      {/* Toggle Button */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className={`text-white p-2 rounded-full mb-4 hover:bg-primary-50 transition duration-300 ${!collapsed ? "ml-4" : "ml-0"} `}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={24} className="text-gray-500" />
        </button>
      )}

      {/* Sidebar Navigation Links */}
      <nav className="flex flex-col space-y-1">
        <SidebarLink
          icon={<House size={24} />}
          label="Home"
          isCollapsed={collapsed}
          isActive={selectedOption === "Home"}
          onClick={() => setSelectedOption("Home")}
        />
        <SidebarLink
          icon={<TicketPercent size={24} />}
          label="Discounted"
          isCollapsed={collapsed}
          isActive={selectedOption === "Discounted"}
          onClick={() => setSelectedOption("Discounted")}
        />
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
