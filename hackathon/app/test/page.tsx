'use client';
import { useState } from 'react';
import Modal from '../components/SubmitModal';

export default function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleYes = () => {
    console.log('User clicked Yes');
    // Add your logic here
    setIsModalOpen(false);
  };

  const handleNo = () => {
    console.log('User clicked No');
    // Add your logic here
    setIsModalOpen(false);
  };

  return (
    <div className="p-8"> 
      <h1 className="text-3xl font-bold underline mb-4">Test Page</h1>
      
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Open Modal
      </button>

      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onYes={handleYes}
        onNo={handleNo}
        name="Test User"
        license="Test License"
        code='1234'
        imageSrc="/logo.svg"
        imageAlt="Test image"
      />   
    </div>
  );
}
