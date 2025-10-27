import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Archive, ArchiveRestore, Edit, Trash2, GripVertical, Scroll } from 'lucide-react';
import { Job } from '../database';
import JobModal from '../components/JobModal';
import { ParchmentCard, WaxSealButton, TorchLoader, Badge, Input, Select } from '../components/ui';

interface JobsResponse {
  data: Job[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const JobsBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: page.toString(),
        pageSize: '10',
        sort: 'order'
      });

      const response = await fetch(`/api/jobs?${params}`);
      const data: JobsResponse = await response.json();
      
      setJobs(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleArchiveJob = async (job: Job) => {
    try {
      await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: job.status === 'active' ? 'archived' : 'active' })
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to archive job:', error);
    }
  };

  const handleDeleteJob = async (job: Job) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await fetch(`/api/jobs/${job.id}`, {
          method: 'DELETE'
        });
        fetchJobs();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, job: Job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetJob: Job) => {
    e.preventDefault();
    
    if (!draggedJob || draggedJob.id === targetJob.id) return;

    try {
      await fetch(`/api/jobs/${draggedJob.id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromOrder: draggedJob.order,
          toOrder: targetJob.order
        })
      });
      
      fetchJobs();
    } catch (error) {
      console.error('Failed to reorder jobs:', error);
      // Rollback optimistic update
      fetchJobs();
    } finally {
      setDraggedJob(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingJob(null);
    fetchJobs();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-medieval font-bold text-castle-stone text-shadow-gold mb-2">
            📜 Quest Board
          </h1>
          <p className="text-lg font-body text-aged-brown-dark">Manage and organize your military campaigns</p>
        </div>
        <WaxSealButton variant="primary" onClick={handleCreateJob}>
          <span className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Post New Quest
          </span>
        </WaxSealButton>
      </div>

      {/* Filters */}
      <ParchmentCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search quests by title or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active Quests' },
                { value: 'archived', label: 'Ancient Scrolls' }
              ]}
            />
          </div>
        </div>
      </ParchmentCard>

      {/* Jobs List */}
      <ParchmentCard className="p-4">
        {loading ? (
          <TorchLoader size="lg" text="Loading quests from the archives..." />
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Scroll className="h-16 w-16 mx-auto text-aged-brown mb-4" />
            <p className="text-xl font-medieval text-castle-stone mb-2">No Quests Found</p>
            <p className="font-body text-aged-brown">Create your first quest to begin recruiting warriors</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                draggable
                onDragStart={(e) => handleDragStart(e, job)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, job)}
                className="parchment-card p-5 cursor-move hover:shadow-embossed transition-all duration-200 group border-2 border-aged-brown"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <GripVertical className="h-6 w-6 text-aged-brown group-hover:text-gold transition-colors flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-xl font-medieval font-bold text-castle-stone hover:text-royal-purple transition-colors"
                        >
                          {job.title}
                        </Link>
                        <Badge
                          variant={job.status === 'active' ? 'active' : 'archived'}
                          icon={job.status === 'active' ? '⚔️' : '📚'}
                        >
                          {job.status === 'active' ? 'Active Campaign' : 'Archived'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 5).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-body bg-gold-light text-castle-stone border border-gold"
                          >
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 5 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-body text-aged-brown">
                            +{job.tags.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="p-2 text-castle-stone hover:text-royal-purple hover:bg-parchment-dark rounded-lg transition-all duration-200"
                      title="Edit quest"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleArchiveJob(job)}
                      className="p-2 text-castle-stone hover:text-gold hover:bg-parchment-dark rounded-lg transition-all duration-200"
                      title={job.status === 'active' ? 'Archive quest' : 'Restore quest'}
                    >
                      {job.status === 'active' ? (
                        <Archive className="h-5 w-5" />
                      ) : (
                        <ArchiveRestore className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job)}
                      className="p-2 text-castle-stone hover:text-blood-red hover:bg-parchment-dark rounded-lg transition-all duration-200"
                      title="Delete quest"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 pt-6 border-t-2 border-aged-brown flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <WaxSealButton
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="gold"
              >
                Previous
              </WaxSealButton>
              <WaxSealButton
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="gold"
              >
                Next
              </WaxSealButton>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-body text-castle-stone">
                  Scroll <span className="font-medieval font-bold">{page}</span> of{' '}
                  <span className="font-medieval font-bold">{totalPages}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <WaxSealButton
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="gold"
                >
                  Previous
                </WaxSealButton>
                <WaxSealButton
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  variant="gold"
                >
                  Next
                </WaxSealButton>
              </div>
            </div>
          </div>
        )}
      </ParchmentCard>

      {showModal && (
        <JobModal
          job={editingJob}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default JobsBoard;
