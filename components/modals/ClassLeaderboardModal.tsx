
// components/modals/ClassLeaderboardModal.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import Modal from '@/components/shared/Modal';

interface Student {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  rank: number;
}

const dummyStudents: Student[] = [
  { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', xp: 1250, rank: 1 },
  { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', xp: 1100, rank: 2 },
  { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', xp: 1050, rank: 3 },
  { id: '4', name: 'David', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g', xp: 900, rank: 4 },
  { id: '5', name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704h', xp: 850, rank: 5 },
];

interface ClassLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ClassLeaderboardModal: React.FC<ClassLeaderboardModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Class Leaderboard" titleIcon={FaTrophy}>
        <div className="mt-4 space-y-4">
          {dummyStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255, 255, 0, 0.5)" }}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-yellow-400 w-6 text-center">{student.rank}</span>
                <Image src={student.avatar} alt={student.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                <span className="font-semibold text-white">{student.name}</span>
              </div>
              <div className="font-bold text-green-400">{student.xp} XP</div>
            </motion.div>
          ))}
        </div>
    </Modal>
  );
};

export default ClassLeaderboardModal;
