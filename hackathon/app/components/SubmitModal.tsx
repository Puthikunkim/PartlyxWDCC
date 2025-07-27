'use client';

import React from 'react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onYes: () => void;
  onNo: () => void;
  name?: string;
  license?: string;
  code?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onYes,
  onNo,
  name = "Wheel",
  license = "ABC123",
  code = "12345",

  imageSrc = "/placeholder-image.jpg",
  imageAlt = "Modal Image"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full min-h-96 mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
                Part Details
            </h2>

          <button
            onClick={onClose}
            className="text-[#6159d0] hover:text-gray-600 transition-colors "
            aria-label="Close modal" >
                X
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-grow">
          <div className="flex items-center h-full">
            <div className="flex-auto w-3/5">
              <p className="text-gray-700 text-s leading-relaxed"> Name: {name}</p>
              <p className="text-gray-700 text-s leading-relaxed"> License: {license}</p>
              <p className="text-gray-700 text-s leading-relaxed"> Code: {code}</p>
            </div>
            <div className=" w-2/5 flex-shrink-0">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <p className="text-gray-700 text-center mb-4"> Would you like to confirm your part? </p>
          <div className="flex justify-center">
            <button
              onClick={onNo}
              className="w-40 mx-5 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium" >
              No
            </button>
            <button
              onClick={onYes}
              className="w-40 mx-5 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
