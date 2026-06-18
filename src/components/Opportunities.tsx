import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Opportunity } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Sparkles, School, Bookmark, ExternalLink, Calendar, Users, Filter, Check } from 'lucide-react';

export const Opportunities: React.FC = () => {
  const { profile, toggleFavorite } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and Searching parameters
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'STEM', 'Programming', 'Research', 'Business', 'Humanities', 'Arts'];

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'opportunities'));
        const list: Opportunity[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Opportunity);
        });
        setOpportunities(list);
      } catch (err) {
        console.error("Error loading Opportunities directory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchText.toLowerCase()) || 
      opp.description.toLowerCase().includes(searchText.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative text-zinc-100">
      
      {/* Search Header panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-zinc-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>Discover Directory</span>
          </div>
          <h2 className="text-3xl font-light text-zinc-100 tracking-tight leading-none">
            Scholar <span className="font-semibold text-white">Programs & Contests</span>
          </h2>
          <p className="text-xs text-zinc-500 max-w-md">
            Filter high school tournaments, scientific research workshops, and fully funded academic fellowships.
          </p>
        </div>

        {/* Searching block */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search programs or organizers..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Category selector pill items */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Directory listings count state status */}
      <div className="flex items-center justify-between text-xs text-zinc-520 font-bold tracking-tight">
        <span>Directories found: {filteredOpportunities.length}</span>
        {searchText && <button onClick={() => setSearchText('')} className="text-indigo-400 underline uppercase tracking-widest text-[9px]">Clear search query</button>}
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-24 border border-zinc-850 bg-zinc-950/20 rounded-2xl p-6">
          <Bookmark className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-400 font-medium">No opportunities match your parameter selection</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">Try adjusting your tracking category or resetting search filters.</p>
        </div>
      ) : (
        /* Real dynamic grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => {
            const isFav = profile?.favorites.includes(opp.id);
            return (
              <div 
                key={opp.id} 
                className="bg-[#0c0c0f] border border-zinc-90 w-full rounded-2xl hover:border-zinc-700 hover:bg-[#0d0d11] transition-all duration-300 flex flex-col justify-between shadow-lg relative group overflow-hidden"
              >
                {/* Image top banner structure */}
                {opp.imageUrl && (
                  <div className="h-40 w-full overflow-hidden bg-zinc-900 relative shrink-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={opp.imageUrl}
                      alt={opp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-zinc-950/20 to-transparent" />
                  </div>
                )}

                {/* Card Inner body container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    {/* Category + Deadline badge row */}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-zinc-950 text-zinc-400 border border-zinc-850 text-[10px] rounded font-semibold uppercase tracking-wider">
                        {opp.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-indigo-400" />
                        <span>Due: {opp.deadline}</span>
                      </span>
                    </div>

                    {/* Program Title, description, organizer */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-wide">
                        <School className="h-3.5 w-3.5 text-zinc-650" />
                        {opp.organization}
                      </span>
                      <h4 className="text-sm font-semibold text-zinc-100 tracking-tight group-hover:text-indigo-400 transition-colors">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-3 pt-1">
                        {opp.description}
                      </p>
                    </div>

                    {/* Target Eligibility parameter */}
                    <div className="px-3 py-2 bg-zinc-950/50 border border-zinc-850 rounded-xl text-[10px] text-zinc-500 flex items-center justify-between gap-2">
                      <span className="font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Users className="h-3 w-3 text-zinc-550" /> Eligibility:
                      </span>
                      <span className="truncate text-zinc-300 font-semibold">{opp.eligibility}</span>
                    </div>
                  </div>

                  {/* Operations links buttons */}
                  <div className="flex gap-2.5 mt-4 border-t border-zinc-900/40 pt-4">
                    <button
                      onClick={() => toggleFavorite(opp.id)}
                      className={`px-3 py-2 border rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1 ${
                        isFav 
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {isFav ? <Check className="h-3 text-emerald-400" /> : <Bookmark className="h-3 text-zinc-500" />}
                      <span>{isFav ? 'Pinned' : 'Pin'}</span>
                    </button>
                    <a
                      href={opp.applicationUrl}
                      target="_blank"
                      rel="no-referrer"
                      className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 text-zinc-300 hover:text-white transition cursor-pointer"
                    >
                      <span>Inspect Target</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
export default Opportunities;
