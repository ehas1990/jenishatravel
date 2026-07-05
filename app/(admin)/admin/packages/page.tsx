'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  Tag, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Eye, 
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Award,
  Sparkles
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
import { getActiveDestinationsDropdown } from '@/actions/destinations';
import { 
  getPackages, 
  createPackage, 
  updatePackage, 
  deletePackage,
  exportPackagesCSV
} from '@/actions/packages';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export default function PackagesPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const currentUserId = session?.user?.id || '';

  // List States
  const [packages, setPackages] = useState<any[]>([]);
  const [activeDestinations, setActiveDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [destFilter, setDestFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [featuredFilter, setFeaturedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(null);

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
  const [destinationId, setDestinationId] = useState('');
  const [category, setCategory] = useState('luxury');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [availableSeats, setAvailableSeats] = useState('10');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<Status>('ACTIVE');

  // Inclusions / Exclusions Tags
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [incInput, setIncInput] = useState('');
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [excInput, setExcInput] = useState('');

  // Itinerary Builder
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [dayTitle, setDayTitle] = useState('');
  const [dayDesc, setDayDesc] = useState('');

  // Load Active Destinations for selection
  useEffect(() => {
    async function loadDestinationsDropdown() {
      const res = await getActiveDestinationsDropdown();
      if (res.destinations) {
        setActiveDestinations(res.destinations);
      }
    }
    loadDestinationsDropdown();
  }, []);

  // Fetch Packages
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPackages({
        search,
        destinationId: destFilter,
        status: statusFilter,
        category: categoryFilter,
        featured: featuredFilter === 'ALL' ? undefined : featuredFilter,
        page,
        limit: pagination.limit
      });

      if (res.error) {
        showToast(res.error, 'error');
      } else {
        setPackages(res.packages || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      showToast('Failed to load packages', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, destFilter, statusFilter, categoryFilter, featuredFilter, page, pagination.limit, showToast]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Tags management
  const addInclusion = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = incInput.trim();
    if (tag && !inclusions.includes(tag)) setInclusions([...inclusions, tag]);
    setIncInput('');
  };

  const removeInclusion = (tag: string) => {
    setInclusions(inclusions.filter(t => t !== tag));
  };

  const addExclusion = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = excInput.trim();
    if (tag && !exclusions.includes(tag)) setExclusions([...exclusions, tag]);
    setExcInput('');
  };

  const removeExclusion = (tag: string) => {
    setExclusions(exclusions.filter(t => t !== tag));
  };

  // Itinerary management
  const addItineraryDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayTitle.trim() || !dayDesc.trim()) return;

    const nextDay = itinerary.length + 1;
    const newDay: ItineraryItem = {
      day: nextDay,
      title: dayTitle.trim(),
      description: dayDesc.trim(),
    };

    setItinerary([...itinerary, newDay]);
    setDayTitle('');
    setDayDesc('');
  };

  const removeItineraryDay = (dayNum: number) => {
    const updated = itinerary
      .filter(item => item.day !== dayNum)
      .map((item, idx) => ({ ...item, day: idx + 1 })); // Recalculate day numbers
    setItinerary(updated);
  };

  // Form Open handlers
  const handleOpenCreate = () => {
    setModalMode('create');
    setName('');
    setDestinationId(activeDestinations[0]?.id || '');
    setCategory('luxury');
    setDuration('');
    setPrice('');
    setDiscountPrice('');
    setShortDescription('');
    setDescription('');
    setThumbnail('');
    setGalleryImages([]);
    setAvailableSeats('10');
    setFeatured(false);
    setStatus('ACTIVE');
    setInclusions([]);
    setExclusions([]);
    setItinerary([]);
    setDayTitle('');
    setDayDesc('');
    setSelectedPkg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: any) => {
    setModalMode('edit');
    setSelectedPkg(pkg);
    setName(pkg.name);
    setDestinationId(pkg.destinationId);
    setCategory(pkg.category);
    setDuration(pkg.duration);
    setPrice(pkg.price.toString());
    setDiscountPrice(pkg.discountPrice ? pkg.discountPrice.toString() : '');
    setShortDescription(pkg.shortDescription);
    setDescription(pkg.description);
    setThumbnail(pkg.thumbnail);
    setGalleryImages(pkg.galleryImages || []);
    setAvailableSeats(pkg.availableSeats.toString());
    setFeatured(pkg.featured);
    setStatus(pkg.status);
    setInclusions(pkg.inclusions || []);
    setExclusions(pkg.exclusions || []);
    
    // Cast itinerary to ItineraryItem array safely
    const rawItinerary = pkg.itinerary;
    setItinerary(Array.isArray(rawItinerary) ? (rawItinerary as ItineraryItem[]) : []);
    
    setDayTitle('');
    setDayDesc('');
    setIsModalOpen(true);
  };

  const handleOpenView = (pkg: any) => {
    setModalMode('view');
    setSelectedPkg(pkg);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (pkg: any) => {
    setSelectedPkg(pkg);
    setIsDeleteModalOpen(true);
  };

  // Submit action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail) {
      showToast('Thumbnail image is required', 'error');
      return;
    }
    if (!destinationId) {
      showToast('Please select a destination', 'error');
      return;
    }

    setSubmitting(true);

    const data = {
      name,
      destinationId,
      category,
      duration,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      shortDescription,
      description,
      galleryImages,
      thumbnail,
      inclusions,
      exclusions,
      itinerary,
      availableSeats: parseInt(availableSeats),
      featured,
      status
    };

    try {
      if (modalMode === 'create') {
        const res = await createPackage(currentUserId, data);
        if (res.error) {
          showToast(res.error, 'error');
        } else {
          showToast('Tour package added successfully!', 'success');
          setIsModalOpen(false);
          fetchPackages();
        }
      } else if (modalMode === 'edit' && selectedPkg) {
        const res = await updatePackage(currentUserId, selectedPkg.id, data);
        if (res.error) {
          showToast(res.error, 'error');
        } else {
          showToast('Tour package updated successfully!', 'success');
          setIsModalOpen(false);
          fetchPackages();
        }
      }
    } catch (err) {
      showToast('Failed to save tour package details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedPkg) return;
    setSubmitting(true);

    try {
      const res = await deletePackage(currentUserId, selectedPkg.id);
      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('Package deleted successfully!', 'success');
        setIsDeleteModalOpen(false);
        fetchPackages();
      }
    } catch (err) {
      showToast('Failed to delete package', 'error');
    } finally {
      setSubmitting(false);
      setSelectedPkg(null);
    }
  };

  // Export CSV Action
  const handleExportCSV = async () => {
    try {
      const res = await exportPackagesCSV();
      if (res.error) {
        showToast(res.error, 'error');
      } else if (res.data) {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `vistaluxe_packages_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV packages list exported successfully!', 'success');
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
          <h1 className="font-heading font-extrabold text-[26px] text-heading">Packages Management</h1>
          <p className="text-[14px] text-paragraph mt-1">Manage tour packages, itineraries, pricing, and seating.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="md" onClick={handleExportCSV} className="flex items-center gap-2 rounded-xl">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="primary" size="md" onClick={handleOpenCreate} className="flex items-center gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            Add Package
          </Button>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="bg-white border border-border p-4 rounded-xl shadow-soft flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full xl:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paragraph/60" />
          <input
            type="text"
            placeholder="Search by package name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-[14px] outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
          {/* Destination */}
          <select
            value={destFilter}
            onChange={(e) => {
              setDestFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 border border-border rounded-xl text-[13.5px] bg-white outline-none focus:border-primary max-w-[160px]"
          >
            <option value="ALL">All Destinations</option>
            {activeDestinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 border border-border rounded-xl text-[13.5px] bg-white outline-none focus:border-primary"
          >
            <option value="ALL">All Styles</option>
            <option value="luxury">Luxury Escape</option>
            <option value="adventure">Adventure Quest</option>
            <option value="cultural">Cultural Journey</option>
            <option value="nature">Nature Sanctuary</option>
          </select>

          {/* Featured */}
          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 border border-border rounded-xl text-[13.5px] bg-white outline-none focus:border-primary"
          >
            <option value="ALL">Featured Status</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 border border-border rounded-xl text-[13.5px] bg-white outline-none focus:border-primary"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Packages Table */}
      <Table
        headers={['Thumbnail', 'Tour Name', 'Destination', 'Duration', 'Price', 'Seats', 'Featured', 'Status', 'Actions']}
        isLoading={loading}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      >
        {packages.map((pkg) => (
          <tr key={pkg.id} className="border-b border-border/40 hover:bg-light-gray/20 transition-colors">
            <td className="px-6 py-4">
              <div className="w-14 h-10 rounded-lg overflow-hidden border border-border bg-light-gray">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pkg.thumbnail} alt={pkg.name} className="w-full h-full object-cover" />
              </div>
            </td>
            <td className="px-6 py-4 font-semibold text-heading text-[14.5px]">{pkg.name}</td>
            <td className="px-6 py-4 text-[14px] text-paragraph">{pkg.destination?.name || 'N/A'}</td>
            <td className="px-6 py-4 text-[14px] text-paragraph">{pkg.duration}</td>
            <td className="px-6 py-4 text-[14px] text-heading font-semibold">
              {pkg.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-emerald-700">${pkg.discountPrice.toLocaleString()}</span>
                  <span className="text-[11px] line-through text-paragraph/60">${pkg.price.toLocaleString()}</span>
                </div>
              ) : (
                <span>${pkg.price.toLocaleString()}</span>
              )}
            </td>
            <td className="px-6 py-4 text-[14px] text-paragraph">{pkg.availableSeats} seats</td>
            <td className="px-6 py-4">
              {pkg.featured ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              ) : (
                <span className="text-[12px] text-paragraph/50">-</span>
              )}
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-lg ${
                pkg.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {pkg.status === 'ACTIVE' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {pkg.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenView(pkg)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  title="Edit details"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDelete(pkg)}
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

      {/* Form / View Modal */}
      {/* View Modal */}
      <Modal
        isOpen={isModalOpen && modalMode === 'view'}
        onClose={() => setIsModalOpen(false)}
        title="View Package Details"
        className="max-w-3xl"
      >
        {selectedPkg && (
          // View Display UI
          <div className="flex flex-col gap-4 py-2 animate-fade-in">
            <div className="w-full h-56 rounded-xl overflow-hidden border border-border relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedPkg.thumbnail} alt={selectedPkg.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-teal-700 text-white px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                {selectedPkg.category}
              </div>
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-[22px] text-heading">{selectedPkg.name}</h2>
              <div className="flex gap-4 text-[13px] text-paragraph mt-1.5">
                <span>Destination: <strong className="text-heading">{selectedPkg.destination?.name}</strong></span>
                <span>Duration: <strong className="text-heading">{selectedPkg.duration}</strong></span>
                <span>Available Seats: <strong className="text-heading">{selectedPkg.availableSeats}</strong></span>
              </div>
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4 text-[14px]">
              <div>
                <span className="font-semibold text-heading block">Original Price:</span>
                <p className="text-paragraph mt-0.5">${selectedPkg.price.toLocaleString()}</p>
              </div>
              {selectedPkg.discountPrice && (
                <div>
                  <span className="font-semibold text-heading block">Discounted Price:</span>
                  <p className="text-emerald-700 font-semibold mt-0.5">${selectedPkg.discountPrice.toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <span className="font-semibold text-heading text-[14px]">Short Description:</span>
              <p className="text-[14.5px] text-paragraph mt-1 leading-relaxed">{selectedPkg.shortDescription}</p>
            </div>

            {selectedPkg.inclusions?.length > 0 && (
              <div className="border-t border-border pt-4">
                <span className="font-semibold text-heading text-[14px] block mb-2">Inclusions:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPkg.inclusions.map((tag: string, idx: number) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[12px] font-semibold">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedPkg.itinerary?.length > 0 && (
              <div className="border-t border-border pt-4">
                <span className="font-semibold text-heading text-[14px] block mb-3">Day-by-Day Itinerary:</span>
                <div className="flex flex-col gap-3">
                  {(selectedPkg.itinerary as ItineraryItem[]).map((day) => (
                    <div key={day.day} className="p-4 border border-border/80 rounded-xl bg-slate-50/50">
                      <h4 className="font-heading font-bold text-heading text-[14.5px]">
                        Day {day.day}: {day.title}
                      </h4>
                      <p className="text-[13.5px] text-paragraph mt-1.5 leading-relaxed">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add / Edit Package Custom Popup Modal */}
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
                  {modalMode === 'create' ? 'Add New Tour Package' : 'Edit Package Details'}
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
                <form id="packageForm" onSubmit={handleSubmit} className="flex flex-col gap-[18px] md:gap-[20px]">
                  {/* Grid fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[18px] md:gap-x-[20px] gap-y-[18px] md:gap-y-[20px]">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Package Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Kerala Premium Tea Escape"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Destination <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                        required
                        disabled={submitting}
                      >
                        <option value="" disabled>Select Destination</option>
                        {activeDestinations.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Travel Style / Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                        disabled={submitting}
                      >
                        <option value="luxury">Luxury Escape</option>
                        <option value="adventure">Adventure Quest</option>
                        <option value="cultural">Cultural Journey</option>
                        <option value="nature">Nature Sanctuary</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Duration <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. 6 Days / 5 Nights"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Available Seats Limit <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        placeholder="10"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Original Price ($) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2400.00"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Discounted Price ($) (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        placeholder="2150.00"
                        className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-medium text-[#1F2937] block">
                        Status
                      </label>
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

                  <ImageUpload
                    value={thumbnail}
                    onChange={(url) => setThumbnail(url as string)}
                    label="Thumbnail Image (Required)"
                  />

                  <ImageUpload
                    value={galleryImages}
                    onChange={(urls) => setGalleryImages(urls as string[])}
                    label="Gallery Images (Optional)"
                    multiple
                  />

                  {/* Inclusions Tag Manager */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1F2937] block">Inclusions (What is provided)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Daily Organic Gourmet Meals (Press Add)"
                        value={incInput}
                        onChange={(e) => setIncInput(e.target.value)}
                        className="flex-grow h-[46px] px-4 border border-border text-[14px] rounded-[10px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white placeholder:text-paragraph/40 transition-all"
                        disabled={submitting}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addInclusion} 
                        className="rounded-[10px] h-[46px] px-5 flex items-center justify-center text-[13.5px]"
                        disabled={submitting}
                      >
                        Add
                      </Button>
                    </div>
                    {inclusions.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 border border-border/60 rounded-xl bg-slate-50/50">
                        {inclusions.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-border text-[12px] font-medium text-[#1F2937] pl-3 pr-1.5 py-1 rounded-[8px]">
                            {tag}
                            <button type="button" onClick={() => removeInclusion(tag)} className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Exclusions Tag Manager */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1F2937] block">Exclusions (What is NOT provided)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Flight to Airport (Press Add)"
                        value={excInput}
                        onChange={(e) => setExcInput(e.target.value)}
                        className="flex-grow h-[46px] px-4 border border-border text-[14px] rounded-[10px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white placeholder:text-paragraph/40 transition-all"
                        disabled={submitting}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addExclusion} 
                        className="rounded-[10px] h-[46px] px-5 flex items-center justify-center text-[13.5px]"
                        disabled={submitting}
                      >
                        Add
                      </Button>
                    </div>
                    {exclusions.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 border border-border/60 rounded-xl bg-slate-50/50">
                        {exclusions.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-border text-[12px] font-medium text-[#1F2937] pl-3 pr-1.5 py-1 rounded-[8px]">
                            {tag}
                            <button type="button" onClick={() => removeExclusion(tag)} className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Day Itinerary Builder */}
                  <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
                    <span className="text-[15px] font-heading font-bold text-heading">Day-by-Day Itinerary Builder</span>
                    
                    <div className="flex flex-col gap-3 p-4 border border-border/80 rounded-xl bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-heading">Add Day {itinerary.length + 1} Plan</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-medium text-[#1F2937] block">Day Title</label>
                        <input
                          type="text"
                          value={dayTitle}
                          onChange={(e) => setDayTitle(e.target.value)}
                          placeholder="e.g. Arrival & Luxury Camp Check-in"
                          className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                          disabled={submitting}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[14px] font-medium text-[#1F2937] block">Day Activities Description</label>
                        <textarea
                          rows={3}
                          placeholder="Enter what travelers will experience on this day..."
                          value={dayDesc}
                          onChange={(e) => setDayDesc(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-border text-[14px] rounded-[10px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                          disabled={submitting}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addItineraryDay} 
                        className="rounded-[10px] h-[40px] px-5 text-[13px] font-semibold w-fit self-end"
                        disabled={submitting}
                      >
                        Add Day {itinerary.length + 1}
                      </Button>
                    </div>

                    {itinerary.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-[13px] font-bold text-heading">Structured Itinerary Checklist:</span>
                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                          {itinerary.map((day) => (
                            <div key={day.day} className="flex items-start justify-between gap-3 p-3 bg-white border border-border rounded-xl">
                              <div className="min-w-0">
                                <h5 className="text-[13.5px] font-bold text-heading">Day {day.day}: {day.title}</h5>
                                <p className="text-[12px] text-paragraph truncate mt-0.5">{day.description}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItineraryDay(day.day)}
                                className="p-1 hover:bg-slate-100 text-rose-500 rounded-lg cursor-pointer"
                                disabled={submitting}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
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
                      placeholder="e.g. A premium tour of Munnar valleys..."
                      className="w-full h-[46px] px-4 border border-border rounded-[10px] text-[14px] text-heading bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-paragraph/40"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <RichText
                    label="Full Details description (Markdown supported)"
                    value={description}
                    onChange={(val) => setDescription(val)}
                    required
                  />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border/60 pt-4">
                    <label className="flex items-center gap-2.5 text-[14px] font-medium text-[#1F2937] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-5 h-5 border border-border rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                        disabled={submitting}
                      />
                      Featured Package (Homepage slide)
                    </label>
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
                  form="packageForm"
                  className="h-[44px] px-6 bg-primary text-white text-[14.0px] font-semibold rounded-[10px] hover:bg-primary-hover shadow-soft active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Package'
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
            Are you sure you want to permanently delete package{' '}
            <span className="font-semibold text-heading">{selectedPkg?.name}</span>? 
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
                'Delete Package'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
