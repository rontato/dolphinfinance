"use client";
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Settings() {
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }
      setSuccess(true);
      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-gray-700 mb-8">This is your settings page. Here you will be able to update your account information, change your password, and manage your preferences.</p>
      {session?.user && (
        <div className="mt-8">
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            disabled={deleting || success}
          >
            {deleting ? 'Deleting...' : success ? 'Account Deleted' : 'Delete Account'}
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">Your account has been deleted. Logging out...</div>}
        </div>
      )}
    </div>
  );
} 