// types/user.ts
import { Timestamp } from 'firebase/firestore';
import { IconType } from 'react-icons';

// CORE ADMIN-FACING DATA
export type UserStatus = 'active' | 'locked' | 'banned';

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    role: string[];
    class?: string;
    created?: Timestamp;
    status?: { type: UserStatus; reason?: string; };
}

// GAMIFICATION DATA
export interface Badge { id: string; icon: IconType; color: string; tooltip: string; description?: string; earnedOn?: string; }
export interface Skill { label: string; percentage: number; color: string; icon: IconType; }

// THE MASTER USER PROFILE - COMBINES EVERYTHING
export interface UserProfile extends UserData {
    avatarUrl: string;
    profileStatus: string; // Renamed from 'status' to avoid conflict with the UserData status object
    xp: { current: number; max: number };
    mastery: string;
    streak: number;
    badges: Badge[];
    skills: Skill[];
    onboardingCompleted?: boolean; // New field for onboarding status
}

// SORTING TYPES FOR ADMIN PANEL (Unchanged)
export type SortableKeys = 'displayName' | 'email' | 'class' | 'created';
export type SortConfig = { key: SortableKeys; direction: 'asc' | 'desc'; };