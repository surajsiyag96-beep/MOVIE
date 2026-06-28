import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search } from 'lucide-react';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
          <Film size={28} />
          <span>MovieFlix</span>
        </Link>
        
        <form onSubmit={handleSearch} className="flex mt-3 w-full sm:mt-0 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full bg-gray-800 text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-white">
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
