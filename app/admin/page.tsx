// app/admin/page.tsx

import DashboardStats from "@/components/admin/DashboardStats"; // <-- IMPORT our new component

const AdminDashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-8">
                Admin Overview
            </h1>

            {/*
        HERE'S THE MAGIC!
        We replace all the old hard-coded divs with our single, smart component.
      */}
            <DashboardStats />

            <p className="mt-8 text-slate-400">Welcome to the command center, bro! Select a section from the sidebar to get started.</p>
        </div>
    );
};

export default AdminDashboardPage;