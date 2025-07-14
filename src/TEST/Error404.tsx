import { Link } from "react-router";

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 text-white font-sans">
      <div className="flex flex-col items-center animate-fade-in">
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-8 drop-shadow-lg"
        >
          <circle cx="90" cy="90" r="80" fill="#fff2" />
          <g>
            <circle cx="90" cy="90" r="60" fill="#fff" className="drop-shadow-xl" />
            <rect x="60" y="80" width="60" height="20" rx="10" fill="#764ba2">
              <animate attributeName="x" values="60;65;60" dur="1.2s" repeatCount="indefinite" />
            </rect>
            <rect x="85" y="55" width="10" height="40" rx="5" fill="#764ba2">
              <animate
                attributeName="height"
                values="40;50;40"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </svg>
        <h1 className="text-5xl font-bold tracking-wide mb-2 drop-shadow-md">Access Denied</h1>
        <Link to="/">
          <button className="px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 outline-none focus:ring-2 focus:ring-white">
            Quay về
          </button>
        </Link>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default Error404;
