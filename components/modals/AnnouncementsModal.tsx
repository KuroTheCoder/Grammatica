// components/modals/AnnouncementsModal.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn } from 'react-icons/fa';
import Modal from '@/components/shared/Modal';

interface Announcement {
  id: string;
  text: string;
  date: string;
}

const dummyAnnouncements: Announcement[] = [
  { id: '1', text: 'Welcome to the new semester! Please update your profiles.', date: '2024-07-28' },
  { id: '2', text: 'The first assignment is due next Friday.', date: '2024-07-27' },
  { id: '3', text: 'Midterm exams will be held in October.', date: '2024-07-25' },
];

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Announcements"
        titleIcon={FaBullhorn}
        headerGradient="from-blue-500 to-cyan-500"
        backgroundClassName="bg-gradient-to-br from-gray-900 to-black [box-shadow:0_0_20px_rgba(59,130,246,0.5)]"
    >
        <div className="mt-4 space-y-3">
          {dummyAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02, y: -5, backgroundColor: '#374151' }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-gray-800/60 rounded-lg cursor-pointer"
            >
              <p className="text-white">{announcement.text}</p>
              <p className="text-xs text-gray-400 mt-1">{announcement.date}</p>
            </motion.div>
          ))}
        </div>
    </Modal>
  );
};

export default AnnouncementsModal;