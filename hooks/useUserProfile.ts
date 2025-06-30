"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // <-- We now use the native onSnapshot!
import { auth, db } from '@/lib/firebase';
import { UserProfile, Badge, Skill } from '@/types/user';

// Import all the icons we need for transformation
import { IconType } from 'react-icons';
import { FaBookOpen, FaPenNib, FaHeadphones, FaMicrophone, FaCrown } from 'react-icons/fa';
import { SiReact, SiNextdotjs } from 'react-icons/si';



const skillIconMap: Record<string, IconType> = {
    Reading: FaBookOpen,
    Writing: FaPenNib,
    Listening: FaHeadphones,
    Speaking: FaMicrophone,
};

const badgeIconMap: Record<string, IconType> = {
    react: SiReact,
    nextjs: SiNextdotjs,
};

export const useUserProfile = () => {
    const [userAuth, loadingAuth, errorAuth] = useAuthState(auth);
    // We go back to managing our own state. More control, more power.
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>(undefined);

    useEffect(() => {
        // If there's no authenticated user, we stop right here.
        if (!userAuth) {
            setLoading(false);
            setProfile(null);
            return;
        }

        // Point the pipe to the right document.
        const userDocRef = doc(db, 'users', userAuth.uid);

        // This is the legendary part. onSnapshot is Firebase's CORE real-time listener.
        const unsubscribe = onSnapshot(userDocRef,
            (docSnap) => {
                // This function runs EVERY time the data changes in the database.
                console.log("NATIVE SNAPSHOT FIRED! Data received."); // Our new test log!

                if (docSnap.exists()) {
                    console.log("NATIVE SNAPSHOT FIRED! Data received.");
                    const rawData = docSnap.data();
                    // Your brilliant processing logic is preserved here.
                    const processedProfile: UserProfile = {
                        uid: userAuth.uid,
                        email: rawData.email || "",
                        role: rawData.role || ["student"],
                        class: rawData.class || "N/A",
                        displayName: rawData.displayName || "New User",
                        avatarUrl: rawData.avatarUrl || 'https://i.pravatar.cc/150',
                        profileStatus: rawData.profileStatus || "Ready to learn!",
                        mastery: rawData.mastery || "N/A",
                        streak: rawData.streak ?? 0,
                        xp: rawData.xp || { current: 0, max: 100 },
                        badges: (rawData.badges || []).map((badge: Omit<Badge, 'icon'>) => ({
                            ...badge,
                            icon: badgeIconMap[badge.id] || FaCrown,
                        })),
                        skills: (rawData.skills || []).map((skill: Omit<Skill, 'icon'>) => ({
                            ...skill,
                            icon: skillIconMap[skill.label] || FaBookOpen,
                        })),
                    };
                    setProfile(processedProfile);
                } else {
                    setProfile(null);
                    console.warn("No user profile found for this user.");
                }
                setLoading(false); // We have data (or know there's none), so we're done loading.
            },
            (err) => {
                // This function runs if the listener itself runs into an error.
                console.error("onSnapshot error:", err);
                setError(err);
                setLoading(false);
            }
        );

        // This is SUPER important. When the component unmounts, we unsubscribe
        // from the listener to prevent memory leaks. This is what libraries do for you.
        return () => unsubscribe();

    }, [userAuth]); // The hook re-runs only when the authenticated user changes.

    return {
        profile,
        loading: loadingAuth || loading,
        error: errorAuth || error,
    };
};