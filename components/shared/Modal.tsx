// app/components/shared/Modal.tsx
"use client";

import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {IconType} from 'react-icons';

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: React.ReactNode,
    titleIcon?: IconType | React.ForwardRefExoticComponent<unknown>,
    headerStyle?: React.CSSProperties,
    backgroundStyle?: React.CSSProperties,
    headerClassName?: string,
    backgroundClassName?: string,
    headerGradient?: string,
    hideCloseButton?: boolean
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         titleIcon: TitleIcon,
                                         headerStyle,
                                         backgroundStyle,
                                         headerClassName,
                                         backgroundClassName,
                                         headerGradient
                                     }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{scale: 0.9, opacity: 0, y: 50}}
                        animate={{scale: 1, opacity: 1, y: 0}}
                        exit={{scale: 0.9, opacity: 0, y: 50}}
                        transition={{type: 'spring', stiffness: 300, damping: 30}}
                        className={`m-auto bg-slate-900/50 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col ${backgroundClassName}`}
                        style={backgroundStyle}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <header
                            className={`flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0 ${headerClassName}`}
                            style={headerStyle}
                        >
                            <div className="flex items-center gap-3">
                                {TitleIcon && <TitleIcon className="text-white/80" size={20}/>}
                                {headerGradient ? (
                                    <h2 className={`text-xl font-bold bg-gradient-to-r ${headerGradient} text-transparent bg-clip-text`}>
                                        {title}
                                    </h2>
                                ) : (
                                    <h2 className="text-xl font-bold text-white">{title}</h2>
                                )}
                            </div>
                            <motion.button
                                whileHover={{scale: 1.1, rotate: 90}}
                                whileTap={{scale: 0.9}}
                                onClick={onClose}
                                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                            >
                                <X size={24}/>
                            </motion.button>
                        </header>

                        {/* Content */}
                        <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;