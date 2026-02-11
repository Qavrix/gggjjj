import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Breadcrumbs from './components/Breadcrumbs';
import { fetchDirectory } from './services/githubService';
import { GithubContent } from './types';
import { ROOT_DIR } from './constants';
import { Loader2, FileCode, Folder, ExternalLink, ArrowLeft, ChevronRight } from 'lucide-react';

// --- Components ---

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
    <Loader2 className="animate-spin mb-4" size={32} />
    <p className="text-sm font-light uppercase tracking-widest">Loading Reports</p>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
    <p className="text-zinc-500 font-light">{message}</p>
  </div>
);

// --- View: Bot List (Home) ---
const HomeView = () => {
  const [bots, setBots] = useState<GithubContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectory(ROOT_DIR).then(data => {
      setBots(data.filter(item => item.type === 'dir'));
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState />;
  if (bots.length === 0) return <EmptyState message="No cBots found in repository." />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bots.map(bot => (
        <a 
          key={bot.name}
          href={`#/bot/${bot.name}`}
          className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-lg hover:border-red-500/50 hover:bg-zinc-900 transition-all duration-300 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-zinc-800 rounded-md group-hover:bg-red-500/10 transition-colors">
              <Folder className="text-zinc-400 group-hover:text-red-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-zinc-200 group-hover:text-white">{bot.name}</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-tighter">View Versions</p>
            </div>
          </div>
          <ChevronRight className="text-zinc-700 group-hover:text-red-500 transition-colors" size={20} />
        </a>
      ))}
    </div>
  );
};

// --- View: Version List ---
const BotDetailView = () => {
  const { botName } = useParams();
  const [versions, setVersions] = useState<GithubContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectory(`${ROOT_DIR}/${botName}`).then(data => {
      setVersions(data.filter(item => item.type === 'dir'));
      setLoading(false);
    });
  }, [botName]);

  if (loading) return <LoadingState />;

  return (
    <div>
      <Breadcrumbs paths={[{ label: botName!, url: `/bot/${botName}` }]} />
      <h2 className="text-2xl font-light mb-8 text-zinc-400">
        Versions for <span className="text-white font-medium">{botName}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {versions.map(v => (
          <a 
            key={v.name}
            href={`#/bot/${botName}/${v.name}`}
            className="group p-5 bg-zinc-900/50 border border-zinc-800 rounded-md hover:border-zinc-500 transition-all"
          >
            <div className="flex flex-col space-y-2">
              <span className="text-xs text-zinc-500 font-mono tracking-tighter">BUILD VERSION</span>
              <span className="text-xl font-medium text-zinc-200 group-hover:text-white">{v.name}</span>
            </div>
          </a>
        ))}
        {versions.length === 0 && <p className="text-zinc-600 italic">No versions logged yet.</p>}
      </div>
    </div>
  );
};

// --- View: Report List ---
const VersionDetailView = () => {
  const { botName, versionName } = useParams();
  const [reports, setReports] = useState<GithubContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectory(`${ROOT_DIR}/${botName}/${versionName}`).then(data => {
      setReports(data.filter(item => item.name.endsWith('.html')));
      setLoading(false);
    });
  }, [botName, versionName]);

  if (loading) return <LoadingState />;

  return (
    <div>
      <Breadcrumbs paths={[
        { label: botName!, url: `/bot/${botName}` },
        { label: versionName!, url: `/bot/${botName}/${versionName}` }
      ]} />
      <h2 className="text-2xl font-light mb-8 text-zinc-400">
        Backtesting Reports <span className="text-white font-medium">{versionName}</span>
      </h2>
      <div className="space-y-3">
        {reports.map(report => (
          <a 
            key={report.name}
            href={`#/report/${botName}/${versionName}/${report.name}`}
            className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:translate-x-1 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <FileCode size={18} className="text-zinc-500 group-hover:text-red-400" />
              <span className="text-zinc-300 font-medium group-hover:text-white">{report.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest hidden sm:block">HTML Report</span>
              <ExternalLink size={16} className="text-zinc-700 group-hover:text-zinc-400" />
            </div>
          </a>
        ))}
        {reports.length === 0 && <EmptyState message="No HTML reports found in this version folder." />}
      </div>
    </div>
  );
};

// --- View: Report Frame ---
const ReportFrameView = () => {
  const { botName, versionName, reportName } = useParams();
  const navigate = useNavigate();
  
  const rawReportUrl = `https://raw.githubusercontent.com/algoqnet/backtesting-reports/main/${ROOT_DIR}/${botName}/${versionName}/${reportName}`;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="h-14 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-medium text-white">{reportName}</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{botName} • {versionName}</p>
          </div>
        </div>
        <a 
          href={rawReportUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 flex items-center space-x-2"
        >
          <ExternalLink size={14} />
          <span>Open Direct</span>
        </a>
      </div>
      <div className="flex-grow bg-white">
        <iframe 
          src={rawReportUrl} 
          className="w-full h-full border-none"
          title="Backtest Report"
        />
      </div>
    </div>
  );
};

// --- Main App ---
const App = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/bot/:botName" element={<BotDetailView />} />
          <Route path="/bot/:botName/:versionName" element={<VersionDetailView />} />
          <Route path="/report/:botName/:versionName/:reportName" element={<ReportFrameView />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;