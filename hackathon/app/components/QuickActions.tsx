import React from 'react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const quickActions = [
    { label: "🚗 Vehicle Info", message: "I need help finding parts for my vehicle. Can you help me?" },
    { label: "🔧 Part Search", message: "I'm looking for a specific part. Can you help me find it?" },
    { label: "💰 Price Check", message: "What's the price range for this type of part?" },
    { label: "📋 Compatibility", message: "How do I know if this part is compatible with my vehicle?" },
    { label: "🚚 Shipping", message: "What are the shipping options and delivery times?" },
    { label: "❓ Installation", message: "Do you provide installation instructions or support?" },
  ];

  return (
    <div className="p-6 border-t border-[#6159d0]/20 dark:border-gray-600 bg-white/60 dark:bg-gray-800">
      <p className="text-base text-[#6159d0] dark:text-gray-400 mb-3 font-medium">Quick actions:</p>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action.message)}
            className="px-4 py-3 text-base bg-white/80 dark:bg-gray-700 border border-[#6159d0]/30 dark:border-gray-600 rounded-lg hover:bg-[#6159d0]/10 dark:hover:bg-gray-600 hover:border-[#6159d0]/50 transition-all duration-200 text-[#6159d0] dark:text-gray-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
