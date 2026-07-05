'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  MapPin, 
  Edit, 
  Trash2, 
  Compass, 
  Plus, 
  X, 
  Eye, 
  Loader2,
  CheckCircle,
  XCircle,
  Globe
} from 'lucide-react';
import { Status } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/ui/ImageUpload';
import RichText from '@/components/ui/RichText';
import { 
  getDestinations, 
  createDestination, 
  updateDestination, 
  deleteDestination 
} from '@/actions/destinations';

export default function DestinationsPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();

  const currentUserId = session?.user?.id || '';

  // List states
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });

  // Modals & Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState<any>(null);

  // Escape key to close custom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && (modalMode === 'create' || modalMode === 'edit')) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, modalMode]);

  // Body overflow locking for custom modal
  useEffect(() => {
    if (isModalOpen && (modalMode === 'create' || modalMode === 'edit')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, modalMode]);

  // Form Fields State
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Popular places input tag state
  const [popularPlaces, setPopularPlaces] = useState<string[]>([]);
  const [placeInput, setPlaceInput] = useState('');
  
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [status, setStatus] = useState<Status>('ACTIVE');

  // Load destinations
  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDestinations({
        search,
        status: statusFilter,
        page,
        limit: pagination.limit
      });

      if (res.error) {
        showToast(res.error, 'error');
      } else {
        setDestinations(res.destinations || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      showToast('Failed to load destinations', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, pagination.limit, showToast]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Tag Manager for Popular Places
  const addPlaceTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = placeInput.trim();
    if (tag && !popularPlaces.includes(tag)) {
      setPopularPlaces([...popularPlaces, tag]);
    }
    setPlaceInput('');
  };

  const removePlaceTag = (tagToRemove: string) => {
    setPopularPlaces(popularPlaces.filter(t => t !== tagToRemove));
  };

  // Open creation modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setName('');
    setCountry('');
    setState('');
    setShortDescription('');
    setDescription('');
    setBannerImage('');
    setGalleryImages([]);
    setPopularPlaces([]);
    setPlaceInput('');
    setBestTimeToVisit('');
    setMapUrl('');
    setStatus('ACTIVE');
    setSelectedDest(null);
    setIsModalOpen(true);
  };

  // Open editor modal
  const handleOpenEdit = (dest: any) => {
    setModalMode('edit');
    setSelectedDest(dest);
    setName(dest.name);
    setCountry(dest.country);
    setState(dest.state || '');
    setShortDescription(dest.shortDescription);
    setDescription(dest.description);
    setBannerImage(dest.bannerImage);
    setGalleryImages(dest.galleryImages || []);
    setPopularPlaces(dest.popularPlaces || []);
    setPlaceInput('');
    setBestTimeToVisit(dest.bestTimeToVisit);
    setMapUrl(dest.mapUrl || '');
    setStatus(dest.status);
    setIsModalOpen(true);
  };

  const handleOpenView = (dest: any) => {
    setModalMode('view');
    setSelectedDest(dest);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (dest: any) => {
    setSelectedDest(dest);
    setIsDeleteModalOpen(true);
  };

  // Submit create or edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImage) {
      showToast('Banner image is required', 'error');
      return;
    }

    setSubmitting(true);

    const data = {
      name,
      country,
      state: state || undefined,
      shortDescription,
      description,
      bannerImage,
      galleryImages,
      popularPlaces,
      bestTimeToVisit,
      mapUrl: mapUrl || undefined,
      status
    };

    try {
      if (modalMode === 'create') {
        const res = await createDestination(currentUserId, data);
        if (res.error) {
          showToast(res.error, 'error');
        } else {
          showToast('Destination created successfully!', 'success');
          setIsModalOpen(false);
          fetchDestinations();
        }
      } else if (modalMode === 'edit' && selectedDest) {
        const res = await updateDestination(currentUserId, selectedDest.id, data);
        if (res.error) {
          showToast(res.error, 'error');
        } else {
          showToast('Destination updated successfully!', 'success');
          setIsModalOpen(false);
          fetchDestinations();
        }
      }
    } catch (err) {
      showToast('Failed to save destination details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete action
  const handleDeleteConfirm = async () => {
    if (!selectedDest) return;
    setSubmitting(true);

    try {
      const res = await deleteDestination(currentUserId, selectedDest.id);
      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('Destination deleted successfully!', 'success');
        setIsDeleteModalOpen(false);
        fetchDestinations();
      }
    } catch (err) {
      showToast('Failed to delete destination', 'error');
    } finally {
      setSubmitting(false);
      setSelectedDest(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-[26px] text-heading">Destinations Management</h1>
          <p className="text-[14px] text-paragraph mt-1">Manage luxury travel countries, regions, and states.</p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenCreate} className="flex items-center gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          Add Destination
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-border p-4 rounded-xl shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paragraph/60" />
          <input
            type="text"
            placeholder="Search by name, country..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-[14px] outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
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

      {/* Grid Table of Destinations */}
      <Table
        headers={['Banner', 'Name', 'Location', 'Best Season', 'Tours Count', 'Status', 'Actions']}
        isLoading={loading}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      >
        {destinations.map((dest) => (
          <tr key={dest.id} className="border-b border-border/40 hover:bg-light-gray/20 transition-colors">
            <td className="px-6 py-4">
              <div className="w-16 h-10 rounded-lg overflow-hidden border border-border bg-light-gray">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dest.bannerImage} alt={dest.name} className="w-full h-full object-cover" />
              </div>
            </td>
            <td className="px-6 py-4 font-semibold text-heading text-[14.5px]">{dest.name}</td>
            <td className="px-6 py-4 text-[14px] text-paragraph">
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                {dest.state ? `${dest.state}, ` : ''}{dest.country}
              </div>
            </td>
            <td className="px-6 py-4 text-[14px] text-paragraph">{dest.bestTimeToVisit}</td>
            <td className="px-6 py-4 text-[14px] font-semibold text-heading">
              {dest._count?.packages || 0} packages
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-lg ${
                dest.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {dest.status === 'ACTIVE' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {dest.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenView(dest)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(dest)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  title="Edit details"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDelete(dest)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* View Modal */}
      <Modal
        isOpen={isModalOpen && modalMode === 'view'}
        onClose={() => setIsModalOpen(false)}
        title="View Destination Details"
        className="max-w-3xl"
      >
        {selectedDest && (
          // View Display UI
          <div className="flex flex-col gap-4 py-2 animate-fade-in">
            <div className="w-full h-56 rounded-xl overflow-hidden border border-border relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedDest.bannerImage} alt={selectedDest.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-[13px] font-semibold backdrop-blur-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {selectedDest.state ? `${selectedDest.state}, ` : ''}{selectedDest.country}
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-[22px] text-heading">{selectedDest.name}</h2>
              <p className="text-[13px] text-paragraph font-bold mt-1">Slug: {selectedDest.slug}</p>
            </div>

            <div className="border-t border-border pt-4 mt-2">
              <span className="font-semibold text-heading text-[14px]">Short Description:</span>
              <p className="text-[14.5px] text-paragraph mt-1 leading-relaxed">{selectedDest.shortDescription}</p>
            </div>

            <div className="border-t border-border pt-4">
              <span className="font-semibold text-heading text-[14px]">Full Details (Markdown):</span>
              <div 
                className="text-[14.5px] text-paragraph mt-2 leading-relaxed prose"
                dangerouslySetInnerHTML={{ __html: selectedDest.description.replace(/\n/g, '<br/>') }}
              />
            </div>

            {selectedDest.popularPlaces?.length > 0 && (
              <div className="border-t border-border pt-4">
                <span className="font-semibold text-heading text-[14px] block mb-2">Popular Attractions:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedDest.popularPlaces.map((tag: string, idx: number) => (
                    <span key={idx} className="bg-teal-50 text-primary border border-teal-100 px-2.5 py-1 rounded-lg text-[12px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-[14px]">
              <div>
                <span className="font-semibold text-heading">Best Time to Visit:</span>
                <p className="text-paragraph mt-0.5">{selectedDest.bestTimeToVisit}</p>
              </div>
              <div>
                <span className="font-semibold text-heading">Status:</span>
                <p className="text-paragraph mt-0.5">{selectedDest.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Destination Custom Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (modalMode === 'create' || modalMode === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-dark-bg/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative z-10 w-full max-w-[850px] bg-white rounded-[16px] shadow-hover border border-border overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] w-[95%] md:w-full"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-[18px] md:p-[24px] lg:p-[28px] pb-[16px] border-b border-border/50 shrink-0">
                <h3 className="font-heading font-semibold text-[#1F2937] text-[18px] md:text-[20px] leading-[1.3] select-none">
                  {modalMode === 'create' ? 'Add New Destination' : 'Edit Destination Details'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-paragraph hover:text-heading hover:bg-light-gray rounded-full transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-grow overflow-y-auto px-[18px] md:px-[24px] lg:px-[28px] py-[20px] md:py-[24px]">
                <form id="destinationForm" onSubmit={handleSubmit} className="flex flex-col gap-[18px] md:gap-[20px]">
                  {/* Grid fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[18px] md:gap-x-[20px] gap-y-[18px] md:gap-y-[20px]">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Destination Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Leh & Nubra Valley"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. India"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Ladakh (optional)"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Best Time to Visit <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bestTimeToVisit}
                        onChange={(e) => setBestTimeToVisit(e.target.value)}
                        placeholder="e.g. June to September"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <ImageUpload
                    value={bannerImage}
                    onChange={(url) => setBannerImage(url as string)}
                    label="Banner Image (Required)"
                  />

                  <ImageUpload
                    value={galleryImages}
                    onChange={(urls) => setGalleryImages(urls as string[])}
                    label="Gallery Images (Optional)"
                    multiple
                  />

                  {/* Popular places tag creator */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1F2937] block">Popular Attractions / Places</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Mattupetty Dam (Press Add)"
                        value={placeInput}
                        onChange={(e) => setPlaceInput(e.target.value)}
                        className="flex-grow h-[46px] px-4 border border-border text-[14px] rounded-[10px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white placeholder:text-paragraph/40 transition-all"
                        disabled={submitting}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addPlaceTag} 
                        className="rounded-[10px] h-[46px] px-5 flex items-center justify-center text-[13.5px]"
                        disabled={submitting}
                      >
                        Add Place
                      </Button>
                    </div>
                    {popularPlaces.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1.5 p-3 border border-border/60 rounded-xl bg-slate-50/50">
                        {popularPlaces.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-border text-[12px] font-medium text-[#1F2937] pl-3 pr-1.5 py-1 rounded-[8px]">
                            {tag}
                            <button type="button" onClick={() => removePlaceTag(tag)} className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-[#1F2937] block">
                      Short Description <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="e.g. Explore snow covered peaks and lakes..."
                      className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <RichText
                    label="Full Description details (Markdown supported)"
                    value={description}
                    onChange={(val) => setDescription(val)}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[18px] md:gap-x-[20px] gap-y-[18px] md:gap-y-[20px] border-t border-border/60 pt-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">Map Embed / Location URL</label>
                      <input
                        type="text"
                        value={mapUrl}
                        onChange={(e) => setMapUrl(e.target.value)}
                        placeholder="Google Maps sharing URL"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">Publish Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                        disabled={submitting}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer - Sticky */}
              <div className="flex justify-end items-center gap-3 px-[18px] md:px-[24px] lg:px-[28px] py-[16px] border-t border-border bg-light-gray/25 sticky bottom-0 z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-[44px] px-6 border border-border text-[14.0px] font-semibold text-heading bg-transparent rounded-[10px] hover:bg-light-gray transition-colors active:scale-[0.98] cursor-pointer"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="destinationForm"
                  className="h-[44px] px-6 bg-primary text-white text-[14.0px] font-semibold rounded-[10px] hover:bg-primary-hover shadow-soft active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Destination'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="flex flex-col gap-4 py-2">
          <p className="text-[14.5px] text-paragraph leading-relaxed">
            Are you sure you want to permanently delete destination{' '}
            <span className="font-semibold text-heading">{selectedDest?.name}</span>? 
            <span className="font-semibold text-rose-600 block mt-2">
              WARNING: This will automatically delete all packages linked to this destination.
            </span>
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
                'Delete Destination'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
