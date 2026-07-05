'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  User as UserIcon,
  Shield,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Role, Status } from '@prisma/client';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/ui/ImageUpload';
import { getUsers, createUser, updateUser, deleteUser, exportUsersCSV } from '@/actions/users';

export default function UsersPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();

  const currentUserId = session?.user?.id || '';

  // State for list loading & params
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 8, totalPages: 1 });

  // State for forms/modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STAFF');
  const [status, setStatus] = useState<Status>('ACTIVE');
  const [image, setImage] = useState('');

  // Fetch users list
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        search,
        status: statusFilter,
        role: roleFilter,
        sortBy,
        sortOrder,
        page,
        limit: pagination.limit
      });

      if (res.error) {
        showToast(res.error, 'error');
      } else {
        setUsers(res.users || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      showToast('Failed to load users list', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, roleFilter, sortBy, sortOrder, page, pagination.limit, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle opening of Create modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('STAFF');
    setStatus('ACTIVE');
    setImage('');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Handle opening of Edit modal
  const handleOpenEdit = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setPhone(user.phone || '');
    setPassword(''); // Leave password blank, only updated if entered
    setRole(user.role);
    setStatus(user.status);
    setImage(user.image || '');
    setIsModalOpen(true);
  };

  // Handle opening of View modal
  const handleOpenView = (user: any) => {
    setModalMode('view');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle opening of Delete modal
  const handleOpenDelete = (user: any) => {
    if (user.id === currentUserId) {
      showToast('You cannot delete your own profile', 'error');
      return;
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        fullName,
        email,
        phone,
        password: password || undefined,
        role,
        status,
        image
      };

      if (modalMode === 'create') {
        const res = await createUser(currentUserId, data);
        if (res.error) {
          showToast(res.error, 'error');
        } else {
          showToast('User created successfully!', 'success');
          setIsModalOpen(false);
          fetchUsers();
        }
      } else if (modalMode === 'edit' && selectedUser) {
        const res = await updateUser(currentUserId, selectedUser.id, data);
        if (res.error) {
          showToast(res.error, 'error');
        } else {
          showToast('User updated successfully!', 'success');
          setIsModalOpen(false);
          fetchUsers();
        }
      }
    } catch (err) {
      showToast('An error occurred during submission', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Confirm Action
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setSubmitting(true);

    try {
      const res = await deleteUser(currentUserId, selectedUser.id);
      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('User deleted successfully!', 'success');
        setIsDeleteModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      showToast('Failed to delete user', 'error');
    } finally {
      setSubmitting(false);
      setSelectedUser(null);
    }
  };

  // Export Users CSV
  const handleExportCSV = async () => {
    try {
      const res = await exportUsersCSV();
      if (res.error) {
        showToast(res.error, 'error');
      } else if (res.data) {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `vistaluxe_users_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV report exported successfully!', 'success');
      }
    } catch (err) {
      showToast('CSV export failed', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-[26px] text-heading">Users Management</h1>
          <p className="text-[14px] text-paragraph mt-1">Manage system editors, administrators, and guest accounts.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="md" onClick={handleExportCSV} className="flex items-center gap-2 rounded-xl">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="primary" size="md" onClick={handleOpenCreate} className="flex items-center gap-2 rounded-xl">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-border p-4 rounded-xl shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paragraph/60" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-[14px] outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-heading hidden sm:inline">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 border border-border rounded-xl text-[14px] bg-white outline-none focus:border-primary"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-heading hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 border border-border rounded-xl text-[14px] bg-white outline-none focus:border-primary"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Table
        headers={['Profile', 'Full Name', 'Email', 'Role', 'Status', 'Joined Date', 'Actions']}
        isLoading={loading}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      >
        {users.map((user) => (
          <tr key={user.id} className="border-b border-border/40 hover:bg-light-gray/20 transition-colors">
            <td className="px-6 py-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-primary overflow-hidden">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
            </td>
            <td className="px-6 py-4 font-semibold text-heading text-[14.5px]">
              {user.fullName}
              {user.id === currentUserId && (
                <span className="ml-2 text-[10px] font-bold bg-teal-50 text-primary px-1.5 py-0.5 rounded">You</span>
              )}
            </td>
            <td className="px-6 py-4 text-[14px] text-paragraph">{user.email}</td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-lg ${
                user.role === 'ADMIN' 
                  ? 'bg-rose-50 text-rose-700' 
                  : user.role === 'EDITOR' 
                  ? 'bg-amber-50 text-amber-700' 
                  : 'bg-teal-50 text-primary'
              }`}>
                <Shield className="w-3.5 h-3.5" />
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-lg ${
                user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {user.status === 'ACTIVE' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {user.status}
              </span>
            </td>
            <td className="px-6 py-4 text-[14px] text-paragraph">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenView(user)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="View User"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(user)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  title="Edit User"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDelete(user)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  title="Delete User"
                  disabled={user.id === currentUserId}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* Create / Edit / View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create'
            ? 'Create New User'
            : modalMode === 'edit'
            ? 'Edit User Profile'
            : 'View User Profile'
        }
      >
        {modalMode === 'view' && selectedUser ? (
          // View Display UI
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="w-24 h-24 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-primary text-[28px] overflow-hidden shadow-soft">
              {selectedUser.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedUser.image} alt={selectedUser.fullName} className="w-full h-full object-cover" />
              ) : (
                selectedUser.fullName.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="text-center">
              <h4 className="font-heading font-bold text-[20px] text-heading">{selectedUser.fullName}</h4>
              <p className="text-[14px] text-paragraph mt-0.5">{selectedUser.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4 border-t border-border/60 pt-4 text-[14px]">
              <div>
                <span className="font-semibold text-heading">Phone:</span>
                <p className="text-paragraph mt-0.5">{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold text-heading">Role:</span>
                <p className="text-paragraph mt-0.5">{selectedUser.role}</p>
              </div>
              <div>
                <span className="font-semibold text-heading">Status:</span>
                <p className="text-paragraph mt-0.5">{selectedUser.status}</p>
              </div>
              <div>
                <span className="font-semibold text-heading">Joined:</span>
                <p className="text-paragraph mt-0.5">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : (
          // Create / Edit Form UI
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ImageUpload
              value={image}
              onChange={(url) => setImage(url as string)}
              label="Profile Image"
            />

            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@vista.luxe"
              required
            />

            <Input
              label="Phone Number"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 0122"
            />

            <Input
              label={modalMode === 'create' ? 'Password' : 'New Password (leave empty to keep current)'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required={modalMode === 'create'}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[14px] font-heading font-semibold text-heading">System Role</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-[14.5px] bg-white outline-none focus:border-primary"
                >
                  <option value="STAFF">Staff</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[14px] font-heading font-semibold text-heading">Account Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-[14.5px] bg-white outline-none focus:border-primary"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="flex flex-col gap-4 py-2">
          <p className="text-[14.5px] text-paragraph leading-relaxed">
            Are you sure you want to permanently delete user{' '}
            <span className="font-semibold text-heading">{selectedUser?.fullName}</span> ({selectedUser?.email})? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="bg-rose-600 hover:bg-rose-700 text-white border-rose-600 focus-visible:outline-rose-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
