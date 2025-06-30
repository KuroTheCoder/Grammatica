// components/modals/AvatarModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

interface AvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const avatarOptions = [
    { id: 1, url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 2, url: '/avatars/avatar-1.jpg' },
    { id: 3, url: '/avatars/avatar-2.jpg' },
    { id: 4, url: '/avatars/avatar-3.jpg' },
    { id: 5, url: '/avatars/avatar-4.jpg' },
    { id: 6, url: '/avatars/avatar-5.jpg' },
];

const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose }) => {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Avatar">
            <div className="flex flex-col gap-6">
                <div>
                    <h4 className="text-sm font-bold text-gray-400 mb-3">Or select a preset</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                        {avatarOptions.map((avatar, index) => (
                            <motion.div
                                key={avatar.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { delay: index * 0.05 } }}
                                whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                                onClick={() => {
                                    console.log(`Selected preset avatar: ${avatar.url}`);
                                    onClose();
                                }}
                                className="cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/30"
                            >
                                <Image src={avatar.url} alt={`Avatar ${avatar.id}`} width={100} height={100} className="object-cover" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-white/10" /></div>
                    <div className="relative flex justify-center"><span className="bg-gray-800 px-2 text-sm text-gray-400">OR</span></div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <label htmlFor="avatar-upload" className="w-full h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-colors relative overflow-hidden">
                        {previewUrl ? (
                            <Image src={previewUrl} alt="Avatar Preview" layout="fill" className="object-cover" />
                        ) : (
                            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="flex flex-col items-center gap-2 text-gray-400">
                                <motion.div variants={{hidden: {scale: 0.5}, visible: {scale: 1}}}><UploadCloud size={48} /></motion.div>
                                <motion.p variants={{hidden: {y: 20}, visible: {y: 0}}} className="font-bold">Click to upload or drag & drop</motion.p>
                                <motion.p variants={{hidden: {y: 20}, visible: {y: 0}}} className="text-xs">PNG, JPG, GIF up to 5MB</motion.p>
                            </motion.div>
                        )}
                    </label>
                    <input id="avatar-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                    <button onClick={() => console.log("Uploading custom image...")} disabled={!previewUrl} className="w-full p-3 font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400">
                        Upload and Set Avatar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AvatarModal;