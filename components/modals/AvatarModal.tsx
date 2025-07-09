"use client";

import React, { useState } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import Modal from '@/components/shared/Modal';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, LoaderCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { FaUserEdit } from 'react-icons/fa';

interface AvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose }) => {
    const [user] = useAuthState(auth);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File is too large. Max 5MB.');
                return;
            }
            setError(null);
            setSuccess(false);
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) {
            setError("No file selected or user not logged in.");
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`/api/avatar/upload?filename=${selectedFile.name}`,
                {
                    method: 'POST',
                    body: selectedFile,
                }
            );

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Upload failed.');
            }

            const newBlob = (await response.json()) as PutBlobResult;
            const newAvatarUrl = newBlob.url;

            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                avatarUrl: newAvatarUrl,
            });

            setSuccess(true);

            setTimeout(() => {
                onClose();
                setTimeout(() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setUploading(false);
                    setSuccess(false);
                }, 300);
            }, 1000);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            console.error("Upload error:", errorMessage);
            setError(errorMessage);
            setUploading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setPreviewUrl(null);
            setSelectedFile(null);
            setUploading(false);
            setSuccess(false);
            setError(null);
        }, 300);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload a New Avatar"
            titleIcon={FaUserEdit}
            headerGradient="from-purple-500 to-pink-500"
            backgroundClassName="bg-gradient-to-br from-gray-900 to-black [box-shadow:0_0_20px_rgba(168,85,247,0.5)]"
        >
            <motion.div
                whileHover={{ scale: 1.01, y: -5 }}
                className="flex flex-col items-center gap-4"
            >
                <label htmlFor="avatar-upload" className="w-full h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-colors relative overflow-hidden">
                    {previewUrl ? (
                        <Image src={previewUrl} alt="Avatar Preview" fill={true} className="object-contain" /> // <-- THE LEGENDARY FIX IS HERE!
                    ) : (
                        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="flex flex-col items-center gap-2 text-gray-400">
                            <motion.div variants={{ hidden: { scale: 0.5 }, visible: { scale: 1 } }}><UploadCloud size={48} /></motion.div>
                            <motion.p variants={{ hidden: { y: 20 }, visible: { y: 0 } }} className="font-bold">Click to upload or drag & drop</motion.p>
                            <motion.p variants={{ hidden: { y: 20 }, visible: { y: 0 } }} className="text-xs">PNG, JPG up to 5MB</motion.p>
                        </motion.div>
                    )}
                </label>
                <input id="avatar-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} disabled={uploading} />

                {error && (
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle size={16} />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full p-3 font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-center gap-2">
                    {uploading ? (
                        <><LoaderCircle className="animate-spin" /> Uploading...</>
                    ) : success ? (
                        <><CheckCircle /> Success!</>
                    ) : (
                        "Upload and Set Avatar"
                    )}
                </button>
            </motion.div>
        </Modal>
    );
};

export default AvatarModal;