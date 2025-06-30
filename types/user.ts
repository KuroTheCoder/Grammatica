
// types/user.ts
import { Timestamp } from 'firebase/firestore';

// All our shared user-related types now live here, exported for the whole app to use.
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

export type SortableKeys = 'displayName' | 'email' | 'class' | 'created';

export type SortConfig = { key: SortableKeys; direction: 'asc' | 'desc'; };