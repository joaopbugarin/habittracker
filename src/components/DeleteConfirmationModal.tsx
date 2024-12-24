'use client'

interface DeleteConfirmationModalProps {
isOpen: boolean;
habitName: string;
onConfirm: () => void;
onCancel: () => void;
}

export const DeleteConfirmationModal = ({
isOpen,
habitName,
onConfirm,
onCancel
}: DeleteConfirmationModalProps) => {
if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      onClick={onCancel}
    />
    
    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all animate-bounce-in">
      {/* Cute rabbit icon or image */}
      <div className="flex justify-center mb-4">
        <img 
          src="/images/sad-rabbit.png" 
          alt="Sad Rabbit" 
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          oh no! are you sure?
        </h3>
        <p className="text-gray-600 mb-6">
          do you really want to delete this habit? 
          this action cannot be undone.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
        >
          keep it
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
        >
          delete it
        </button>
      </div>
    </div>
  </div>
);
};