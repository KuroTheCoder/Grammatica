"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, query, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { FaPen, FaTrash, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const useAdminAuth = () => {
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingRole, setIsCheckingRole] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdminRole = async () => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists() && Array.isArray(userDoc.data().role) && userDoc.data().role.includes('admin')) {
                    setIsAdmin(true);
                } else {
                    router.replace('/Home');
                }
            } else if (!loading) {
                router.replace('/Login');
            }
            setIsCheckingRole(false);
        };
        checkAdminRole();
    }, [user, loading, router]);

    return { user, isAdmin, loading: loading || isCheckingRole };
};

const AdminPage = () => {
    const { isAdmin, loading } = useAdminAuth();
    if (loading) {
        return ( <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white"><FaSpinner className="animate-spin text-4xl" /></div> );
    }
    if (!isAdmin) {
        return null;
    }
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-8">Admin Dashboard</h1>
                <AnnouncementManager />
            </div>
        </div>
    );
};
AdminPage.displayName = 'AdminPage';

const AnnouncementManager = () => {
    const announcementsQuery = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    const [announcements, loading, error] = useCollection(announcementsQuery);
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState('FaBullhorn');
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        if (isEditing) {
            await updateDoc(doc(db, 'announcements', isEditing), { title, icon });
        } else {
            await addDoc(collection(db, 'announcements'), { title, icon, date: serverTimestamp() });
        }
        resetForm();
    };

    const handleEdit = (announcementDoc: QueryDocumentSnapshot<DocumentData>) => {
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
                                    <div><p className="font-medium">{data.title}</p><p className="text-xs text-slate-400">{data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : '...'} - Icon: {data.icon}</p></div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleEdit(doc)} className="text-slate-400 hover:text-sky-400 transition-colors"><FaPen /></button>
                                        <button onClick={() => handleDelete(doc.id)} className="text-slate-400 hover:text-red-400 transition-colors"><FaTrash /></button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
AnnouncementManager.displayName = 'AnnouncementManager';

export default AdminPage;