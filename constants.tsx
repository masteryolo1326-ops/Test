import React from 'react';
import type { Language, Slate } from './types';

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'jp', name: '日本語' },
];

export const SLATES_DATA: Slate[] = [
  {
    id: 1,
    name: 'Innovate & Elevate',
    president: 'Alex Johnson',
    vicePresident: 'Maria Garcia',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=480&h=320&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Future Forward',
    president: 'James Smith',
    vicePresident: 'Priya Patel',
    imageUrl: 'https://images.unsplash.com/photo-1528795259121-4a8397b9c127?q=80&w=480&h=320&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Unity & Progress',
    president: 'Chloe Williams',
    vicePresident: 'Kenji Tanaka',
    imageUrl: 'https://images.unsplash.com/photo-1579965342575-154a4a4f88cb?q=80&w=480&h=320&auto=format&fit=crop',
  },
    {
    id: 4,
    name: 'Visionary Leaders',
    president: 'David Chen',
    vicePresident: 'Sophia Rodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d387a17f67?q=80&w=480&h=320&auto=format&fit=crop',
  },
];

// Icon Components
export const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="url(#icon-gradient)" fillRule="evenodd" d="M4.5 3A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5V4.5A1.5 1.5 0 0 0 19.5 3h-15ZM8 9.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H8.75A.75.75 0 0 1 8 9.75Z" clipRule="evenodd" />
    </svg>
);

export const HomeIcon = ({isActive}: {isActive?: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill={isActive ? "url(#icon-gradient)" : "currentColor"}>
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.69-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.06 1.06l8.69-8.69Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 1-.75-.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
);
export const UserPlusIcon = ({isActive}: {isActive?: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill={isActive ? "url(#icon-gradient)" : "currentColor"}>
        <path d="M6.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM3.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM19.75 7.5a.75.75 0 0 0-1.5 0v2.25H16a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H22a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
    </svg>
);
export const LoginIcon = ({isActive}: {isActive?: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill={isActive ? "url(#icon-gradient)" : "currentColor"}>
        <path d="M15.75 8.25a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Z" />
        <path d="M4.5 3.75A1.75 1.75 0 0 0 2.75 5.5v13A1.75 1.75 0 0 0 4.5 20.25h8.375a.75.75 0 0 1 0-1.5H4.5a.25.25 0 0 1-.25-.25V5.5a.25.25 0 0 1 .25-.25h8.375a.75.75 0 0 1 0-1.5H4.5Z" />
        <path fillRule="evenodd" d="M19.03 11.47a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H11.25a.75.75 0 0 1 0-1.5h5.44l-3.22-3.22a.75.75 0 0 1 1.06-1.06l4.5 4.5Z" clipRule="evenodd" />
    </svg>
);
export const LogoutIcon = ({isActive}: {isActive?: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill={isActive ? "url(#icon-gradient)" : "currentColor"}>
        <path d="M8.25 8.25a.75.75 0 0 0-1.5 0V15a.75.75 0 0 0 1.5 0V8.25Z" />
        <path d="M19.5 3.75A1.75 1.75 0 0 1 21.25 5.5v13a1.75 1.75 0 0 1-1.75 1.75h-8.375a.75.75 0 0 0 0 1.5h8.375A3.25 3.25 0 0 0 22.75 18.5v-13A3.25 3.25 0 0 0 19.5 2.25h-8.375a.75.75 0 0 0 0 1.5H19.5Z" />
        <path fillRule="evenodd" d="M4.97 11.47a.75.75 0 0 0 0 1.06l4.5 4.5a.75.75 0 0 0 1.06-1.06L7.31 12.75H12.75a.75.75 0 0 0 0-1.5H7.31l3.22-3.22a.75.75 0 0 0-1.06-1.06l-4.5 4.5Z" clipRule="evenodd" />
    </svg>
);
export const VoteIcon = ({isActive}: {isActive?: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill={isActive ? "url(#icon-gradient)" : "currentColor"}>
        <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v14.5c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0 0 22 19.25V4.75A1.75 1.75 0 0 0 20.25 3H3.75Z" />
        <path fillRule="evenodd" d="M14.47 10.53a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 1.06-1.06L9.69 14.22l3.72-3.72a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
    </svg>
);
export const UserIcon = ({isActive}: {isActive?: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill={isActive ? "url(#icon-gradient)" : "currentColor"}>
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653ZM6.443 15.862A7.123 7.123 0 0 1 12 15a7.123 7.123 0 0 1 5.557.862 7.218 7.218 0 0 1-11.114 0ZM12 6a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" clipRule="evenodd" />
    </svg>
);
export const LanguageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12.0001 8.99988C12.5524 8.99988 13.0001 8.55217 13.0001 7.99988C13.0001 7.44759 12.5524 6.99988 12.0001 6.99988C11.4478 6.99988 11.0001 7.44759 11.0001 7.99988C11.0001 8.55217 11.4478 8.99988 12.0001 8.99988Z" />
        <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" />
        <path d="M12.0001 16.9999C15.0377 16.9999 17.7296 15.3349 19.2526 12.9999H4.74756C6.27056 15.3349 8.96246 16.9999 12.0001 16.9999Z" />
    </svg>
);
export const TicketIcon = ({isActive}: {isActive?: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill={isActive ? "url(#icon-gradient)" : "currentColor"}>
        <path fillRule="evenodd" d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5A2.25 2.25 0 0 1 22.5 6.75v10.5A2.25 2.25 0 0 1 20.25 19.5H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75ZM8.25 17.25a.75.75 0 0 0 0-1.5h7.5a.75.75 0 0 0 0 1.5h-7.5ZM8.25 13.5a.75.75 0 0 0 0-1.5h7.5a.75.75 0 0 0 0 1.5h-7.5ZM8.25 9.75a.75.75 0 0 0 0-1.5h7.5a.75.75 0 0 0 0 1.5h-7.5Z" clipRule="evenodd" />
    </svg>
);
export const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#icon-gradient)" className="w-20 h-20 mx-auto">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);

export const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1 text-green-400">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
    </svg>
);
export const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75c0-5.056 2.383-9.555 6.084-12.436A6.75 6.75 0 0 1 21 9.75a.75.75 0 0 1-.75.75c-5.056 0-9.555-2.383-12.436-6.084a6.75 6.75 0 0 1-8.166-8.166.75.75 0 0 1 .75-.75c5.056 0 9.555 2.383 12.436 6.084a6.75 6.75 0 0 1 8.166 8.166.75.75 0 0 1-.75.75Z" clipRule="evenodd" />
    </svg>
);
export const UserCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
    </svg>
);
export const EnvelopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
    </svg>
);
export const LockClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
);
export const FormUserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 0 0 .41-1.412A9.99 9.99 0 0 0 10 12c-2.31 0-4.438.784-6.131 2.095Z" />
    </svg>
);

export const DocumentArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

export const LandingSecureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
    </svg>
);

export const LandingModernIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
    <path d="M13 2L3 14h9l-1 8 9-12h-9l1-8z" />
  </svg>
);

export const LandingMultiLingualIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
        <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM8.5 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-5 7a4.5 4.5 0 01-4.33-6.13.75.75 0 111.4.52 3 3 0 005.86 0 .75.75 0 111.4-.52A4.5 4.5 0 0110.5 17.5z" clipRule="evenodd" />
    </svg>
);