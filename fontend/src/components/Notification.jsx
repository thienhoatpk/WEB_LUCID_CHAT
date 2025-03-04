import { useState, useEffect } from "react";

const Notification = ({ type, content, time, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 bg-white shadow-lg rounded-lg p-4 w-80 border-l-4 border-blue-500 
        transition-all duration-300 ease-in-out transform 
        ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-600">{type === 1 ? "Notify" : "New message"}</h3>
        <button
          className="text-gray-400 hover:text-red-500"
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
        >
          ✖
        </button>
      </div>
      <p className="text-gray-700">{content}</p>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  );
};

export default Notification;
