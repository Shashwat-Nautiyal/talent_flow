import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db, Candidate } from '../database';
import { User } from 'lucide-react';
import { Badge, TorchLoader } from '../components/ui';

interface Stage {
  id: Candidate['stage'];
  title: string;
  icon: string;
  color: string;
}

const stages: Stage[] = [
  { id: 'applied', title: 'Applied Recruits', icon: '🛡️', color: 'bg-castle-stone-light' },
  { id: 'screen', title: 'Initial Screening', icon: '⚔️', color: 'bg-aged-brown' },
  { id: 'tech', title: 'Combat Trials', icon: '🗡️', color: 'bg-royal-purple' },
  { id: 'offer', title: 'Royal Offer', icon: '📜', color: 'bg-gold-dark' },
  { id: 'hired', title: 'Recruited Knights', icon: '👑', color: 'bg-forest-green' },
  { id: 'rejected', title: 'Declined', icon: '⚠️', color: 'bg-blood-red' },
];

interface CandidateCardProps {
  candidate: Candidate;
}

const SortableCandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: candidate.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="parchment-card p-4 mb-3 cursor-move hover:shadow-embossed transition-shadow">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blood-red rounded-full flex items-center justify-center flex-shrink-0 shadow-wax-seal">
            <User className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medieval font-bold text-castle-stone truncate">
              {candidate.name}
            </h4>
            <p className="text-sm font-body text-aged-brown truncate">
              {candidate.email}
            </p>
            {candidate.notes && (
              <p className="text-xs font-body text-aged-brown-dark mt-2 italic">
                {candidate.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    const allCandidates = await db.candidates.toArray();
    setCandidates(allCandidates);
    setLoading(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const candidateId = active.id as string;
    const newStage = over.id as Candidate['stage'];

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    // Optimistic update
    setCandidates(prev =>
      prev.map(c => c.id === candidateId ? { ...c, stage: newStage, updatedAt: new Date() } : c)
    );

    try {
      // Update in database
      await db.candidates.update(candidateId, {
        stage: newStage,
        updatedAt: new Date()
      });

      // Add timeline entry
      await db.candidateTimeline.add({
        id: crypto.randomUUID(),
        candidateId,
        stage: newStage,
        timestamp: new Date(),
        note: `Moved to ${newStage}`
      });
    } catch (error) {
      console.error('Failed to update candidate:', error);
      // Rollback on error
      loadCandidates();
    }
  };

  const getCandidatesByStage = (stage: Candidate['stage']) => {
    return candidates.filter(c => c.stage === stage);
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  if (loading) {
    return (
      <div className="p-8">
        <TorchLoader size="lg" text="Preparing the War Room..." />
      </div>
    );
  }

  return (
    <div className="h-screen bg-parchment overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-medieval font-bold text-castle-stone text-shadow-gold mb-2">
            ⚔️ War Room Strategy Board
          </h1>
          <p className="font-body text-aged-brown-dark text-lg">
            Manage your recruitment pipeline. Drag warriors between ranks to update their status.
          </p>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pb-6">
            {stages.map((stage) => {
              const stageCandidates = getCandidatesByStage(stage.id);
              
              return (
                <SortableContext
                  key={stage.id}
                  id={stage.id}
                  items={stageCandidates.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col h-[calc(100vh-250px)]">
                    <div className={`${stage.color} text-parchment p-4 rounded-t-lg border-4 border-aged-brown`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medieval font-bold text-lg flex items-center gap-2">
                          <span>{stage.icon}</span>
                          {stage.title}
                        </h3>
                      </div>
                      <Badge variant="default" className="text-xs">
                        {stageCandidates.length} Warriors
                      </Badge>
                    </div>
                    
                    <div
                      className="flex-1 bg-parchment-dark border-4 border-t-0 border-aged-brown rounded-b-lg p-3 overflow-y-auto"
                      style={{ minHeight: '200px' }}
                    >
                      {stageCandidates.length === 0 ? (
                        <div className="text-center py-8 text-aged-brown font-body italic">
                          No warriors in this rank
                        </div>
                      ) : (
                        stageCandidates.map((candidate) => (
                          <SortableCandidateCard key={candidate.id} candidate={candidate} />
                        ))
                      )}
                    </div>
                  </div>
                </SortableContext>
              );
            })}
          </div>

          <DragOverlay>
            {activeCandidate ? (
              <div className="parchment-card p-4 cursor-grabbing shadow-lg rotate-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blood-red rounded-full flex items-center justify-center shadow-wax-seal">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-medieval font-bold text-castle-stone">
                      {activeCandidate.name}
                    </h4>
                    <p className="text-sm font-body text-aged-brown">
                      {activeCandidate.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
