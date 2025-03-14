import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen max-w-full bg-dark-charcoal text-white flex flex-col overflow-hidden">
      <div className="flex-grow flex flex-col overflow-auto">{children}</div>

      {/* Responsive footer */}
      <footer className="p-4 text-center text-sm text-gray-400 bg-charcoal">
        <p>T-Align &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
