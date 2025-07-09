// contexts/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconType } from 'react-icons';
import NotificationToast from '@/components/shared/NotificationToast';

interface NotificationContextType {
    showNotification: (message: string, icon?: IconType, gradient?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<{
        message: string;
        icon?: IconType;
        gradient?: string;
        isVisible: boolean;
    }>({ message: '', isVisible: false });

    const showNotification = useCallback((message: string, icon?: IconType, gradient?: string) => {
        setNotification({ message, icon, gradient, isVisible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, isVisible: false }));
        }, 3000); // Notification visible for 3 seconds
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <NotificationToast
                message={notification.message}
                icon={notification.icon}
                gradient={notification.gradient}
                isVisible={notification.isVisible}
            />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
