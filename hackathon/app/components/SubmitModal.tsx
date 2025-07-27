'use client';

import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

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
  onFormSubmit?: (formData: { name: string; email: string; message: string }) => void;
}

const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onYes,
  onNo,
  name = "Wheel",
  license = "ABC123",
  code = "12345",
  imageSrc = "/default-image.png",
  imageAlt = "Part Image",
  onFormSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    console.log('Initializing EmailJS with public key:', "lbQt3qFB32eJhrG4Z");
    
    try {
      emailjs.init({
        publicKey: "lbQt3qFB32eJhrG4Z",
      });
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required');
      }

      // Check if EmailJS is loaded
      if (!emailjs) {
        throw new Error('EmailJS not loaded');
      }

      // Prepare email template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message || 'No additional message provided',
        part_name: name,
        part_license: license,
        part_code: code,
        to_name: 'Admin', // You can customize this
      };

      console.log('EmailJS object:', emailjs);
      console.log('Sending email with params:', templateParams);
      console.log('Service ID:', 'service_xbfx4hn');
      console.log('Template ID:', 'template_g6i8e06');

      // Send email using EmailJS with explicit public key
      const result = await emailjs.send(
        'service_xbfx4hn',    // Your service ID
        'template_g6i8e06',   // Your template ID
        templateParams,
        {
          publicKey: 'lbQt3qFB32eJhrG4Z' // Try passing the public key explicitly
        }
      );

      console.log('Email sent successfully:', result);
      
      // Call the original onFormSubmit if provided
      if (onFormSubmit) {
        onFormSubmit(formData);
      }
      
      // Close modal and call onYes
      onYes();
      
    } catch (error) {
      console.error('Failed to send email - Raw error:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      
      // More comprehensive error handling
      let errorMessage = 'Unknown error occurred';
      let errorDetails: any = {};
      
      if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails.message = error.message;
        errorDetails.stack = error.stack;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // EmailJS errors might be objects with specific properties
        errorDetails = {
          status: (error as any).status,
          text: (error as any).text,
          message: (error as any).message,
          name: (error as any).name,
          fullError: error
        };
        
        // Try to extract a meaningful message
        if ((error as any).text) {
          errorMessage = `EmailJS Error: ${(error as any).text}`;
        } else if ((error as any).message) {
          errorMessage = (error as any).message;
        } else if ((error as any).status) {
          errorMessage = `EmailJS Error - Status: ${(error as any).status}`;
        }
      }
      
      console.error('Processed error details:', errorDetails);
      
      // Show user-friendly error message
      alert(`Failed to send email: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="">
      <div className="fixed inset-0 bg-[#6159d080] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full min-h-96 mx-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                  Part Order Details
              </h2>

            <button
              onClick={onClose}
              className="text-[#6159d0] hover:text-[#5149b0] transition duration-300"
              aria-label="Close modal" >
                  X
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex-grow">
            <div className="space-y-6">
              {/* Part Details Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Part Details</h3>
                <div className="flex items-start space-x-4">
                  <div className="flex-1 space-y-2">
                    <p className="text-gray-700 text-sm"> Part Name: {name}</p>
                    <p className="text-gray-700 text-sm"> License: {license}</p>
                    <p className="text-gray-700 text-sm"> Code: {code}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Submission Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="text-[#383e42] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="text-[#383e42] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Message </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="text-[#383e42] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter any additional message"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            <p className="text-gray-700 text-center mb-4"> Would you like to confirm your part order? </p>
            <div className="flex justify-center">
              <button
                onClick={onNo}
                className="w-40 mx-5 px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-md hover:scale-105 hover:text-gray-600 hover:bg-[#989898] transition duration-300"
              >
                No
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-40 mx-5 px-4 py-2 font-medium text-white rounded-md transition-all duration-200 ease-in-out ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
