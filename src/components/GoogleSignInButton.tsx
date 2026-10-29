import React from 'react';
import { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';

interface GoogleSignInButtonProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isLoading?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  user,
  onSignIn,
  onSignOut,
  isLoading = false,
}) => {
  if (user) {
    return (
      <div className="flex items-center gap-2 bg-white/90 dark:bg-stone-800 border border-emerald-200 dark:border-stone-700 px-3 py-1.5 rounded-full shadow-xs text-xs">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-5 h-5 rounded-full object-cover border border-emerald-500"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <span className="font-medium text-stone-700 dark:text-stone-200 truncate max-w-[130px]">
          {user.displayName || user.email}
        </span>
        <button
          onClick={onSignOut}
          title="Sign out"
          className="ml-1 text-stone-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700"
        >
          <LogOut size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      disabled={isLoading}
      type="button"
      className="inline-flex items-center justify-center gap-2.5 px-3.5 py-1.5 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-300 rounded-full shadow-xs hover:shadow transition-all disabled:opacity-60 cursor-pointer"
    >
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.43 7.37 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.1z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
        />
      </svg>
      <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
    </button>
  );
};
