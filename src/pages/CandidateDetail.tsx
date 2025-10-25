import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, MessageSquare, Edit } from 'lucide-react';
import { Candidate, CandidateTimeline } from '../database';

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [timeline, setTimeline] = useState<CandidateTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const [candidateResponse, timelineResponse] = await Promise.all([
          fetch(`/api/candidates/${id}`),
          fetch(`/api/candidates/${id}/timeline`)
        ]);

        if (candidateResponse.ok) {
          const candidateData = await candidateResponse.json();
          setCandidate(candidateData);
          setNotes(candidateData.notes || '');
        }

        if (timelineResponse.ok) {
          const timelineData = await timelineResponse.json();
          setTimeline(timelineData);
        }
      } catch (error) {
        console.error('Failed to fetch candidate:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleStageChange = async (newStage: Candidate['stage']) => {
    if (!candidate) return;

    try {
      await fetch(`/api/candidates/${candidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });

      // Refresh data
      const [candidateResponse, timelineResponse] = await Promise.all([
        fetch(`/api/candidates/${id}`),
        fetch(`/api/candidates/${id}/timeline`)
      ]);

      if (candidateResponse.ok) {
        const candidateData = await candidateResponse.json();
        setCandidate(candidateData);
      }

      if (timelineResponse.ok) {
        const timelineData = await timelineResponse.json();
        setTimeline(timelineData);
      }
    } catch (error) {
      console.error('Failed to update candidate stage:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!candidate) return;

    try {
      await fetch(`/api/candidates/${candidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });

      setCandidate(prev => prev ? { ...prev, notes } : null);
      setShowNotesModal(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const getStageColor = (stage: Candidate['stage']) => {
    switch (stage) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screen': return 'bg-yellow-100 text-yellow-800';
      case 'tech': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Candidate not found</h2>
        <p className="mt-2 text-gray-600">The candidate you're looking for doesn't exist.</p>
        <Link
          to="/candidates"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/candidates"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Candidates
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNotesModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Notes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Info */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{candidate.name}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
                    {candidate.stage}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-3" />
                {candidate.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-3" />
                Applied {new Date(candidate.appliedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-3" />
                Updated {new Date(candidate.updatedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Stage Actions */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Move to Stage</h3>
              <div className="space-y-2">
                {stages.map(stage => (
                  <button
                    key={stage}
                    onClick={() => handleStageChange(stage)}
                    disabled={candidate.stage === stage}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      candidate.stage === stage
                        ? 'bg-indigo-100 text-indigo-800 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            {candidate.notes && (
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{candidate.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Timeline</h2>
            </div>
            <div className="px-6 py-4">
              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline events</h3>
                  <p className="text-gray-500">Timeline events will appear here as the candidate progresses.</p>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {timeline
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {eventIdx !== timeline.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.stage === 'hired' ? 'bg-green-500' :
                                  event.stage === 'rejected' ? 'bg-red-500' :
                                  'bg-indigo-500'
                                }`}>
                                  <Calendar className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Moved to <span className="font-medium text-gray-900 capitalize">{event.stage}</span>
                                  </p>
                                  {event.note && (
                                    <p className="mt-1 text-sm text-gray-600">{event.note}</p>
                                  )}
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time dateTime={new Date(event.timestamp).toISOString()}>
                                    {new Date(event.timestamp).toLocaleDateString()}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNotesModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Notes</h3>
                  <button
                    type="button"
                    onClick={() => setShowNotesModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-6 w-6" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add notes about this candidate..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSaveNotes}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
