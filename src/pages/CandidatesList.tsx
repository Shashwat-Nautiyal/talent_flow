import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, User, Mail, Calendar } from 'lucide-react';
// import * as ReactWindow from 'react-window';
import { Candidate } from '../database';

interface CandidatesResponse {
  data: Candidate[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const CandidateItem = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Candidate[] }) => {
  const candidate = data[index];
  
  const getStageColor = (stage: Candidate['stage']) => {
    switch (stage) {
      case 'applied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'screen': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'tech': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offer': return 'bg-green-100 text-green-800 border-green-200';
      case 'hired': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div style={style} className="px-4 py-3">
      <Link
        to={`/candidates/${candidate.id}`}
        className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 p-5 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-200">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <p className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                  {candidate.name}
                </p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStageColor(candidate.stage)}`}>
                  {candidate.stage}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {candidate.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Applied {new Date(candidate.appliedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-sm text-gray-500">
              Updated {new Date(candidate.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CandidatesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || '');
  const [totalCandidates, setTotalCandidates] = useState(0);

  const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        stage: stageFilter,
        page: '1',
        pageSize: '1000' // Get all for virtualization
      });

      const response = await fetch(`/api/candidates?${params}`);
      const data: CandidatesResponse = await response.json();
      
      setCandidates(data.data);
      setTotalCandidates(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    if (search) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stageFilter) {
      filtered = filtered.filter(candidate => candidate.stage === stageFilter);
    }

    return filtered;
  }, [candidates, search, stageFilter]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSearchParams(prev => {
      if (value) {
        prev.set('search', value);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  const handleStageFilterChange = (value: string) => {
    setStageFilter(value);
    setSearchParams(prev => {
      if (value) {
        prev.set('stage', value);
      } else {
        prev.delete('stage');
      }
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage and track candidate applications</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{totalCandidates}</div>
          <div className="text-sm text-gray-500">total candidates</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={stageFilter}
              onChange={(e) => handleStageFilterChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading candidates...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-16 w-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">
              {search || stageFilter
                ? 'Try adjusting your search or filter criteria.'
                : 'No candidates have been added yet.'}
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredCandidates.map((candidate, index) => (
              <CandidateItem
                key={candidate.id}
                index={index}
                style={{}}
                data={filteredCandidates}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stage Statistics */}
      {!loading && candidates.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Candidates by Stage</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {stages.map(stage => {
              const count = candidates.filter(c => c.stage === stage).length;
              const percentage = candidates.length > 0 ? (count / candidates.length) * 100 : 0;
              
              const getStageColor = (stage: string) => {
                switch (stage) {
                  case 'applied': return 'from-blue-500 to-blue-600';
                  case 'screen': return 'from-yellow-500 to-yellow-600';
                  case 'tech': return 'from-purple-500 to-purple-600';
                  case 'offer': return 'from-green-500 to-green-600';
                  case 'hired': return 'from-emerald-500 to-emerald-600';
                  case 'rejected': return 'from-red-500 to-red-600';
                  default: return 'from-gray-500 to-gray-600';
                }
              };
              
              return (
                <div key={stage} className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{count}</div>
                  <div className="text-sm font-semibold text-gray-600 capitalize mb-3">{stage}</div>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${getStageColor(stage)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
