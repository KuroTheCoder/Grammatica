"use client";

import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface ProfileEditorModalProps {
    onClose: () => void;
}

const ProfileEditorModal = ({ onClose }: ProfileEditorModalProps) => {
    return (
        <div>
            <div className="flex items-center justify-between">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                    Edit Profile
                </Dialog.Title>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-700">
                    <X size={20} />
                </button>
            </div>
            <div className="mt-4">
                <p className="text-sm text-neutral-400">
                    Here you can change your avatar, status, and featured badges. This is a placeholder for now. Let&#39;s build this out next!
                </p>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-600 focus:outline-none"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none"
                    onClick={() => {
                        console.log('Saving profile...');
                        onClose();
                    }}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfileEditorModal;