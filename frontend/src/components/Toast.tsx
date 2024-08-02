import { createPortal } from "react-dom";
import { useEffect } from 'react';
import { Info, OctagonX, CircleCheck, TriangleAlert, CircleAlert, X } from 'lucide-react';

const toastTypes = {
  info: {
    icon: Info,
    styles: "text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800",
    buttonStyles: "bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:hover:bg-gray-700 dark:text-blue-400 dark:bg-gray-800"
  },
  danger: {
    icon: OctagonX,
    styles: "text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800",
    buttonStyles: "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:bg-gray-700 dark:text-red-400 dark:bg-gray-800"
  },
  success: {
    icon: CircleCheck,
    styles: "text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800",
    buttonStyles: "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:hover:bg-gray-700 dark:text-green-400 dark:bg-gray-800"
  },
  alert: {
    icon: TriangleAlert,
    styles: "text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:bg-gray-800 dark:border-yellow-800",
    buttonStyles: "bg-yellow-50 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:hover:bg-gray-700 dark:text-yellow-300 dark:bg-gray-800"
  },
  dark: {
    icon: CircleAlert,
    styles: "border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600",
    buttonStyles: "bg-gray-50 text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
  }
};

const Toast = ({ type, message, duration }: { type: 'info' | 'danger' | 'success' | 'alert' | 'dark' , message: string, duration: number }) => {
  const toastType = toastTypes[type] || toastTypes.info;
  const { icon: Icon, styles, buttonStyles } = toastType;

  useEffect(() => {
    const timer = setTimeout(() => {
      const toastElement = document.getElementById('toast');
      if (toastElement) {
        toastElement.remove();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return createPortal(
    <div
      id="toast"
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center max-w-xs space-x-4 rtl:space-x-reverse p-4 mb-4 ${styles}`}
      role="alert"
    >
      <Icon className="flex-shrink-0 w-4 h-4" />
      <div className="ms-3 text-sm font-medium">
        {message}
      </div>
      <button
        type="button"
        className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${buttonStyles}`}
        data-dismiss-target="#toast"
        aria-label="Close"
        onClick={() => document.getElementById('toast')?.remove()}
      >
        <span className="sr-only">Descartar</span>
        <X className="w-4 h-4" />
      </button>
    </div>
    , document.body);
};

export default Toast;
