import { useEffect } from "react";

const CustomAlert = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close alert after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const alertStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg ${alertStyles[type]}`}>
      {message}
    </div>
  );
};

export default CustomAlert;
