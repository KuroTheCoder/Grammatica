// components/modals/ClassLeaderboardModal.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import Modal from '@/components/shared/Modal';
import { useClassLeaderboard } from '@/hooks/useClassLeaderboard';
import PulseLoader from '@/components/ui/PulseLoader';

interface ClassLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ClassLeaderboardModal: React.FC<ClassLeaderboardModalProps> = ({ isOpen, onClose, className }) => {
  const { leaderboard, loading, error } = useClassLeaderboard(className);

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`${className || ''} Leaderboard`}
        titleIcon={FaTrophy}
        headerGradient="from-yellow-400 to-orange-500"
        backgroundClassName="bg-gradient-to-br from-gray-900 to-black [box-shadow:0_0_20px_rgba(255,212,74,0.5)]"
    >
        <div className="mt-4 space-y-4">
            {loading && <div className="flex justify-center"><PulseLoader /></div>}
            {error && <p className="text-red-500 text-center">Error: {error.message}</p>}
            {!loading && !error && leaderboard.length === 0 && (
                <p className="text-gray-400 text-center py-8">This class has no ranked students yet.</p>
            )}
            {!loading && !error && leaderboard.map((student, index) => (
                <motion.div
                    key={student.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255, 255, 0, 0.5)" }}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-yellow-400 w-6 text-center">{index + 1}</span>
                        <Image src={student.avatarUrl || '/avatars/avatar-1.jpg'} alt={student.displayName || 'Student'} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                        <span className="font-semibold text-white">{student.displayName}</span>
                    </div>
                    <div className="font-bold text-green-400">{student.xp.current} XP</div>
                </motion.div>
            ))}
        </div>
    </Modal>
  );
};

export default ClassLeaderboardModal;