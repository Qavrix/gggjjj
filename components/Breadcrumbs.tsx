
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  paths: { label: string; url: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-zinc-500 mb-8">
      <Link to="/" className="hover:text-white transition-colors">Home</Link>
      {paths.map((path, idx) => (
        <React.Fragment key={path.url}>
          <ChevronRight size={14} />
          <Link 
            to={path.url} 
            className={`transition-colors ${idx === paths.length - 1 ? 'text-zinc-100 font-medium' : 'hover:text-white'}`}
          >
            {path.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
