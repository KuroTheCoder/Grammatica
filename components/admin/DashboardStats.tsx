// components/admin/DashboardStats.tsx
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaUsers, FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";

// A reusable UI card for each statistic. Clean and professional.
const StatCard = ({ title, value, icon, color, loading }: { title: string, value: string, icon: React.ReactNode, color: string, loading: boolean }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
            <div className={`text-2xl ${color}`}>{icon}</div>
        </div>
        {loading ? (
            // A "skeleton" loader so it looks good while fetching data
            <div className="h-10 w-20 bg-slate-700 rounded-md animate-pulse mt-2"></div>
        ) : (
            <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
        )}
    </div>
);


// The main component that fetches and holds the data
const DashboardStats = () => {
    // State to hold our fetched numbers. Start with '...' as a placeholder.
    const [stats, setStats] = useState({
        userCount: '...',
        teacherCount: '...',
        studentCount: '...',
        // We'll add essayCount later!
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // To get TOTAL USERS, we just need to get all docs in the 'users' collection.
                const usersQuery = query(collection(db, "users"));
                const userSnapshot = await getDocs(usersQuery);
                const userCount = userSnapshot.size;

                // To get TEACHERS, we query for users where the 'role' array contains 'teacher'.
                const teachersQuery = query(collection(db, "users"), where("role", "array-contains", "teacher"));
                const teacherSnapshot = await getDocs(teachersQuery);
                const teacherCount = teacherSnapshot.size;

                // TODO: Add essay count logic here when ready
                // const essaySnapshot = await getDocs(collection(db, "essays"));
                // const essayCount = essaySnapshot.size;

                setStats({
                    userCount: userCount.toString(),
                    teacherCount: teacherCount.toString(),
                    studentCount: (userCount - teacherCount).toString(),
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                // If there's an error, display 'N/A'
                setStats({ userCount: 'N/A', teacherCount: 'N/A', studentCount: 'N/A' });
            } finally {
                // This runs whether it succeeds or fails.
                setLoading(false);
            }
        };

        fetchStats();
    }, []); // The empty array [] means this runs only once when the component mounts.

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Total Users"
                value={stats.userCount}
                icon={<FaUsers />}
                color="text-sky-400"
                loading={loading}
            />
            <StatCard
                title="Active Teachers"
                value={stats.teacherCount}
                icon={<FaChalkboardTeacher />}
                color="text-amber-400"
                loading={loading}
            />
            <StatCard
                title="Enrolled Students"
                value={stats.studentCount}
                icon={<FaGraduationCap />}
                color="text-emerald-400"
                loading={loading}
            />
            {/* We can add a card for Essays Graded here later! */}
        </div>
    )
};

export default DashboardStats;