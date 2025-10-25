import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye, Save } from 'lucide-react';
import { Assessment, AssessmentSection, AssessmentQuestion } from '../database';

const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setAssessment(data);
        } else {
          // Create new assessment if none exists
          setAssessment({
            id: crypto.randomUUID(),
            jobId: jobId!,
            title: 'Assessment',
            sections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } catch (error) {
        console.error('Failed to fetch assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchAssessment();
    }
  }, [jobId]);

  const addSection = () => {
    if (!assessment) return;

    const newSection: AssessmentSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      questions: []
    };

    setAssessment(prev => prev ? {
      ...prev,
      sections: [...prev.sections, newSection]
    } : null);
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    if (!assessment) return;

    setAssessment(prev => prev ? {
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    } : null);
  };

  const removeSection = (sectionId: string) => {
    if (!assessment) return;

    setAssessment(prev => prev ? {
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    } : null);
  };

  const addQuestion = (sectionId: string) => {
    if (!assessment) return;

    const newQuestion: AssessmentQuestion = {
      id: crypto.randomUUID(),
      type: 'short-text',
      question: 'New Question',
      required: true
    };

    setAssessment(prev => prev ? {
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    } : null);
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<AssessmentQuestion>) => {
    if (!assessment) return;

    setAssessment(prev => prev ? {
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId ? { ...question, ...updates } : question
              )
            }
          : section
      )
    } : null);
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    if (!assessment) return;

    setAssessment(prev => prev ? {
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
          : section
      )
    } : null);
  };

  const saveAssessment = async () => {
    if (!assessment) return;

    setSaving(true);
    try {
      await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment)
      });
    } catch (error) {
      console.error('Failed to save assessment:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Assessment not found</h2>
        <Link
          to="/jobs"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/jobs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={saveAssessment}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-lg font-medium text-gray-900">Assessment Builder</h1>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Title
                </label>
                <input
                  type="text"
                  value={assessment.title}
                  onChange={(e) => setAssessment(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-6">
                {assessment.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        className="text-lg font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addQuestion(section.id)}
                          className="p-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {section.questions.map((question, questionIndex) => (
                        <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-500">
                                Q{questionIndex + 1}
                              </span>
                              <select
                                value={question.type}
                                onChange={(e) => updateQuestion(section.id, question.id, { type: e.target.value as any })}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="short-text">Short Text</option>
                                <option value="long-text">Long Text</option>
                                <option value="single-choice">Single Choice</option>
                                <option value="multi-choice">Multiple Choice</option>
                                <option value="numeric">Numeric</option>
                                <option value="file-upload">File Upload</option>
                              </select>
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) => updateQuestion(section.id, question.id, { required: e.target.checked })}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-600">Required</span>
                              </label>
                              <button
                                onClick={() => removeQuestion(section.id, question.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestion(section.id, question.id, { question: e.target.value })}
                            placeholder="Enter question text..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />

                          {(question.type === 'single-choice' || question.type === 'multi-choice') && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options (one per line)
                              </label>
                              <textarea
                                value={question.options?.join('\n') || ''}
                                onChange={(e) => updateQuestion(section.id, question.id, { 
                                  options: e.target.value.split('\n').filter(opt => opt.trim()) 
                                })}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                              />
                            </div>
                          )}

                          {question.type === 'numeric' && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Min Value
                                </label>
                                <input
                                  type="number"
                                  value={question.min || ''}
                                  onChange={(e) => updateQuestion(section.id, question.id, { min: parseInt(e.target.value) || undefined })}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Max Value
                                </label>
                                <input
                                  type="number"
                                  value={question.max || ''}
                                  onChange={(e) => updateQuestion(section.id, question.id, { max: parseInt(e.target.value) || undefined })}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            </div>
                          )}

                          {(question.type === 'short-text' || question.type === 'long-text') && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Length
                              </label>
                              <input
                                type="number"
                                value={question.maxLength || ''}
                                onChange={(e) => updateQuestion(section.id, question.id, { maxLength: parseInt(e.target.value) || undefined })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSection}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <Plus className="h-6 w-6 mx-auto mb-2" />
                  Add Section
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Live Preview</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
                
                {assessment.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
                    
                    {section.questions.map((question, questionIndex) => (
                      <div key={question.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {question.type === 'short-text' && (
                          <input
                            type="text"
                            disabled
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                            placeholder="Your answer..."
                          />
                        )}
                        
                        {question.type === 'long-text' && (
                          <textarea
                            disabled
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                            placeholder="Your answer..."
                          />
                        )}
                        
                        {question.type === 'single-choice' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center">
                                <input
                                  type="radio"
                                  disabled
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'multi-choice' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'numeric' && (
                          <input
                            type="number"
                            disabled
                            min={question.min}
                            max={question.max}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                            placeholder="Enter number..."
                          />
                        )}
                        
                        {question.type === 'file-upload' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">File upload area</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilder;
