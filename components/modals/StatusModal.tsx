// components/modals/StatusModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import { motion } from 'framer-motion';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStatus: string;
}

const MAX_STATUS_LENGTH = 100;

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, currentStatus }) => {
    const [statusText, setStatusText] = React.useState(currentStatus);
    const charactersLeft = MAX_STATUS_LENGTH - statusText.length;

    React.useEffect(() => {
        // When the modal opens, sync the text with the current status from props
        if (isOpen) {
            setStatusText(currentStatus);
        }
    }, [isOpen, currentStatus]);

    const handleSave = () => {
        // Later, this will call a Firebase update function
        console.log("Saving new status:", statusText);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update Your Status">
            <div className="flex flex-col gap-4">
                <textarea
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    maxLength={MAX_STATUS_LENGTH}
                    placeholder="What are you working on?"
                    className="w-full h-24 p-3 bg-white/5 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    autoFocus
                />
                <div className="flex justify-between items-center">
                    <p className={`text-sm ${charactersLeft < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                        {charactersLeft} characters remaining
                    </p>
                    <motion.button
                        onClick={handleSave}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
                    >
                        Save
                    </motion.button>
                </div>
            </div>
        </Modal>
    );
};

export default StatusModal;