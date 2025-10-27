import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scroll, Shield, Swords } from 'lucide-react';
import { db } from '../database';
import { WaxSealButton } from '../components/ui';

const LandingPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalQuests: 0,
    activeQuests: 0,
    totalRecruits: 0,
    recruitedKnights: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const jobs = await db.jobs.toArray();
      const candidates = await db.candidates.toArray();
      
      setStats({
        totalQuests: jobs.length,
        activeQuests: jobs.filter(j => j.status === 'active').length,
        totalRecruits: candidates.length,
        recruitedKnights: candidates.filter(c => c.stage === 'hired').length,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-castle-wall py-24 px-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block animate-torch-flicker">🏰</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medieval font-bold text-gold text-shadow-gold mb-6">
            Welcome to the Royal Recruitment Hall
          </h1>
          <p className="text-xl md:text-2xl font-body text-gold-light mb-12 max-w-3xl mx-auto">
            Where valor meets opportunity. Recruit the finest warriors, manage glorious quests, 
            and build the mightiest army the Kingdom has ever seen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/jobs">
              <WaxSealButton variant="primary" className="text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  <Scroll className="w-5 h-5" />
                  View Quest Board
                </span>
              </WaxSealButton>
            </Link>
            <Link to="/candidates">
              <WaxSealButton variant="gold" className="text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Royal Registry
                </span>
              </WaxSealButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="parchment-card torn-edge text-center p-8 hover:shadow-embossed transition-shadow">
            <div className="text-5xl mb-4">📜</div>
            <div className="text-4xl font-medieval font-bold text-castle-stone mb-2">
              {stats.totalQuests}
            </div>
            <div className="text-lg font-body text-aged-brown">
              Total Quests
            </div>
          </div>

          <div className="parchment-card torn-edge text-center p-8 hover:shadow-embossed transition-shadow">
            <div className="text-5xl mb-4">⚔️</div>
            <div className="text-4xl font-medieval font-bold text-forest-green mb-2">
              {stats.activeQuests}
            </div>
            <div className="text-lg font-body text-aged-brown">
              Active Campaigns
            </div>
          </div>

          <div className="parchment-card torn-edge text-center p-8 hover:shadow-embossed transition-shadow">
            <div className="text-5xl mb-4">🛡️</div>
            <div className="text-4xl font-medieval font-bold text-castle-stone mb-2">
              {stats.totalRecruits}
            </div>
            <div className="text-lg font-body text-aged-brown">
              Total Recruits
            </div>
          </div>

          <div className="parchment-card torn-edge text-center p-8 hover:shadow-embossed transition-shadow">
            <div className="text-5xl mb-4">👑</div>
            <div className="text-4xl font-medieval font-bold text-gold mb-2">
              {stats.recruitedKnights}
            </div>
            <div className="text-lg font-body text-aged-brown">
              Recruited Knights
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-medieval font-bold text-castle-stone text-center mb-12">
          Command Your Army
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="parchment-card p-8">
            <div className="w-16 h-16 bg-blood-red rounded-full flex items-center justify-center mb-6 shadow-wax-seal">
              <Scroll className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-2xl font-medieval font-bold text-castle-stone mb-4">
              Quest Management
            </h3>
            <p className="font-body text-aged-brown-dark leading-relaxed">
              Create and manage military campaigns with ease. Organize quests, set requirements, 
              and track progress through intuitive parchment-style interfaces.
            </p>
          </div>

          <div className="parchment-card p-8">
            <div className="w-16 h-16 bg-blood-red rounded-full flex items-center justify-center mb-6 shadow-wax-seal">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-2xl font-medieval font-bold text-castle-stone mb-4">
              Warrior Registry
            </h3>
            <p className="font-body text-aged-brown-dark leading-relaxed">
              Maintain detailed records of your recruits. Track their journey from squires to elite 
              knights through comprehensive achievement scrolls.
            </p>
          </div>

          <div className="parchment-card p-8">
            <div className="w-16 h-16 bg-blood-red rounded-full flex items-center justify-center mb-6 shadow-wax-seal">
              <Swords className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-2xl font-medieval font-bold text-castle-stone mb-4">
              War Room Strategy
            </h3>
            <p className="font-body text-aged-brown-dark leading-relaxed">
              Visualize your recruitment pipeline through an interactive war room. Move warriors 
              between ranks with strategic drag-and-drop controls.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-castle-wall py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-medieval font-bold text-gold text-shadow-gold mb-6">
            Begin Your Recruitment Campaign
          </h2>
          <p className="text-xl font-body text-gold-light mb-8">
            Join the ranks of legendary commanders. Start building your army today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs">
              <WaxSealButton variant="primary" className="text-lg px-8 py-3">
                Post a Quest
              </WaxSealButton>
            </Link>
            <Link to="/pipeline">
              <WaxSealButton variant="gold" className="text-lg px-8 py-3">
                Enter War Room
              </WaxSealButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-gold-trim bg-castle-stone py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-gold-light italic text-lg">
            "For the glory of the Kingdom, we recruit only the bravest"
          </p>
          <p className="font-medieval text-gold text-sm mt-4">
            TalentFlow © {new Date().getFullYear()} - Royal Recruitment Division
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
