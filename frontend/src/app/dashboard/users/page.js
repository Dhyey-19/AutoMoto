'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/api';
import { TableSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { 
  Users, 
  Plus, 
  RotateCcw, 
  ShieldAlert, 
  Mail, 
  User, 
  Lock,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';

export default function UserManagementPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state triggers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleConfirmOpen, setIsRoleConfirmOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

  // Load user records
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  const handleCreateUser = async (data) => {
    try {
      const res = await userService.createUser(data);
      setUsers((prev) => [res.data, ...prev]);
      setIsAddOpen(false);
      reset();
      toast.success('User account registered successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to create user account.');
    }
  };

  // Toggle user active status (Active <-> Inactive)
  const promptUserStatus = (userRecord) => {
    setSelectedUser(userRecord);
    setIsStatusConfirmOpen(true);
  };

  const handleConfirmStatus = async () => {
    if (!selectedUser) return;
    const targetStatus = !selectedUser.IsActive;
    try {
      await userService.updateUserStatus(selectedUser.UserId, targetStatus);
      setUsers((prev) =>
        prev.map((u) => (u.UserId === selectedUser.UserId ? { ...u, IsActive: targetStatus } : u))
      );
      toast.success(`User successfully ${targetStatus ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to change user status.');
    } finally {
      setIsStatusConfirmOpen(false);
      setSelectedUser(null);
    }
  };

  // Toggle user role tier (ADMIN <-> USER)
  const promptUserRole = (userRecord) => {
    setSelectedUser(userRecord);
    setIsRoleConfirmOpen(true);
  };

  const handleConfirmRole = async () => {
    if (!selectedUser) return;
    const targetRole = selectedUser.Role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await userService.updateUserRole(selectedUser.UserId, targetRole);
      setUsers((prev) =>
        prev.map((u) => (u.UserId === selectedUser.UserId ? { ...u, Role: targetRole } : u))
      );
      toast.success(`Role successfully changed to ${targetRole}.`);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to update user role.');
    } finally {
      setIsRoleConfirmOpen(false);
      setSelectedUser(null);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 animate-pulse mb-3" />
        <h3 className="text-lg font-bold text-brand-text">Access Denied</h3>
        <p className="text-sm text-brand-muted mt-1 font-light">Loading permissions or redirecting...</p>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.FullName.toLowerCase().includes(term) ||
      u.Email.toLowerCase().includes(term) ||
      u.Role.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-brand-muted font-light -mt-2">
            Configure dealership staff tiers, admin privileges, and user status toggles.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadUsers}
            className="p-2.5 rounded-xl border border-brand-border bg-brand-card hover:bg-brand-border/20 text-brand-text transition-colors cursor-pointer"
            title="Reload Users"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center space-x-1.5 rounded-xl gold-gradient text-white px-5 py-2.5 text-sm font-bold shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Filter staff accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
        />
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-sm">
          <TableSkeleton rows={6} cols={5} />
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={loadUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No Accounts Found"
          description={searchTerm ? "No users match your filter keyword." : "There are currently no staff accounts registered."}
          actionLabel={searchTerm ? "Clear Search Filter" : "Create First Staff Account"}
          onAction={searchTerm ? () => setSearchTerm('') : () => setIsAddOpen(true)}
        />
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-border/20 border-b border-brand-border text-xs text-brand-muted uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role Tier</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {filteredUsers.map((userRecord) => (
                  <tr key={userRecord.UserId} className="hover:bg-brand-border/10 transition-colors">
                    {/* User profile initials + name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                          {userRecord.FullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-brand-text">{userRecord.FullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-text font-medium">{userRecord.Email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-2xs font-extrabold uppercase tracking-wide ${
                          userRecord.Role === 'ADMIN'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-brand-border/40 text-brand-muted'
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        <span>{userRecord.Role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-extrabold uppercase tracking-wide ${
                          userRecord.IsActive
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {userRecord.IsActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* Admin Access Controls toggle buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => promptUserRole(userRecord)}
                          className="text-xs bg-brand-border/40 hover:bg-accent hover:text-white text-brand-text px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 cursor-pointer"
                          title="Toggle Role Tier"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => promptUserStatus(userRecord)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            userRecord.IsActive
                              ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
                              : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                          title={userRecord.IsActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {userRecord.IsActive ? (
                            <UserX className="h-4.5 w-4.5" />
                          ) : (
                            <UserCheck className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Account Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Dealership Staff Account">
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Staff Full Name"
                {...register('name', { required: 'Full name is required' })}
                className="w-full rounded-xl border border-brand-border bg-transparent pl-10 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="Email Address"
                {...register('email', { required: 'Email address is required' })}
                className="w-full rounded-xl border border-brand-border bg-transparent pl-10 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Default Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="🔒 Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full rounded-xl border border-brand-border bg-transparent pl-10 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          {/* Role Tier */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Security Tier Role</label>
            <select
              {...register('role')}
              className="w-full rounded-xl border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-brand-text focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
            >
              <option value="USER">USER - Standard Staff</option>
              <option value="ADMIN">ADMIN - Showroom Manager</option>
            </select>
          </div>

          {/* Footer controls */}
          <div className="pt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-text hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl gold-gradient text-white text-sm font-bold shadow hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isSubmitting ? 'Registering...' : 'Register Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Role Confirmation Dialog */}
      {selectedUser && (
        <ConfirmDialog
          isOpen={isRoleConfirmOpen}
          onClose={() => {
            setIsRoleConfirmOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmRole}
          title="Modify Account Role Tier"
          message={`Are you sure you want to change the security tier of ${selectedUser.FullName} to ${
            selectedUser.Role === 'ADMIN' ? 'USER' : 'ADMIN'
          }?`}
          confirmLabel="Change Role"
          type="accent"
        />
      )}

      {/* Status Confirmation Dialog */}
      {selectedUser && (
        <ConfirmDialog
          isOpen={isStatusConfirmOpen}
          onClose={() => {
            setIsStatusConfirmOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmStatus}
          title={selectedUser.IsActive ? 'Deactivate Account' : 'Activate Account'}
          message={`Are you sure you want to ${selectedUser.IsActive ? 'deactivate' : 'activate'} the account for ${
            selectedUser.FullName
          }? ${selectedUser.IsActive ? 'This will lock them out of the portal.' : 'This will restore their access.'}`}
          confirmLabel={selectedUser.IsActive ? 'Deactivate' : 'Activate'}
          type={selectedUser.IsActive ? 'danger' : 'accent'}
        />
      )}
    </div>
  );
}
