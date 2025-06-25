// app/admin/announcements/page.tsx
"use client";

import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, query, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { FaPen, FaTrash, FaBullhorn, FaWrench, FaInfoCircle, FaGraduationCap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// A simple component to render the correct icon
const DynamicIcon = ({ name }: { name: string }) => {
    switch (name) {
        case 'FaBullhorn': return <FaBullhorn className="inline mr-2" />;
        case 'FaWrench': return <FaWrench className="inline mr-2" />;
        case 'FaInfoCircle': return <FaInfoCircle className="inline mr-2" />;
        case 'FaGraduationCap': return <FaGraduationCap className="inline mr-2" />;
        default: return <FaBullhorn className="inline mr-2" />;
    }
}

const AnnouncementManager = () => {
    const announcementsQuery = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    const [announcements, loading, error] = useCollection(announcementsQuery);
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState('FaBullhorn');
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            if (isEditing) {
                await updateDoc(doc(db, 'announcements', isEditing), { title, icon });
            } else {
                await addDoc(collection(db, 'announcements'), { title, icon, date: serverTimestamp() });
            }
            resetForm();
        } catch (err) {
            console.error("Failed to save announcement:", err);
        }
    };

    const handleEditAction = (announcementDoc: QueryDocumentSnapshot<DocumentData>) => {
        setIsEditing(announcementDoc.id);
        const data = announcementDoc.data();
        setTitle(data.title);
        setIcon(data.icon);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            await deleteDoc(doc(db, 'announcements', id));
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setTitle('');
        setIcon('FaBullhorn');
    };
    const iconOptions = ['FaBullhorn', 'FaWrench', 'FaInfoCircle', 'FaGraduationCap'];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-8">Announcement Manager</h1>
            <div className="space-y-8">
                <motion.div layout className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Announcement' : 'Add New Announcement'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Title</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., System Maintenance" className="w-full bg-slate-700 rounded-md p-2 border border-slate-600 focus:ring-emerald-500 focus:border-emerald-500" required /></div>
                        <div><label htmlFor="icon" className="block text-sm font-medium text-slate-400 mb-1">Icon</label><select id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full bg-slate-700 rounded-md p-2 border border-slate-600 focus:ring-emerald-500 focus:border-emerald-500">{iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                        <div className="flex gap-4 pt-2"><button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-md py-2 font-semibold transition-colors">{isEditing ? 'Update' : 'Add'}</button>{isEditing && (<button type="button" onClick={resetForm} className="bg-slate-600 hover:bg-slate-500 rounded-md py-2 px-4 font-semibold transition-colors">Cancel</button>)}</div>
                    </form>
                </motion.div>
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">Current Announcements</h2>
                    {loading && <p>Loading announcements...</p>}
                    {error && <p className="text-red-400">Error: {error.message}</p>}
                    <div className="space-y-3">
                        <AnimatePresence>
                            {announcements?.docs.map((doc) => {
                                const data = doc.data();
                                return (
                                    <motion.div key={doc.id} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="flex items-center justify-between bg-slate-700 p-3 rounded-md">
                                        <div className="flex items-center">
                                            <DynamicIcon name={data.icon} />
                                            <div>
                                                <p className="font-medium">{data.title}</p>
                                                <p className="text-xs text-slate-400">{data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : '...'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEditAction(doc)} className="text-slate-400 hover:text-sky-400 transition-colors"><FaPen /></button>
                                            <button onClick={() => handleDelete(doc.id)} className="text-slate-400 hover:text-red-400 transition-colors"><FaTrash /></button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementManager;