import React from 'react';
import { Link } from 'react-router-dom';

const MinimalFooter = () => {
  return (
    <footer className="bg-background/50 border-t border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-foreground/70">
            © {new Date().getFullYear()} PureCare. All rights reserved.
          </div>
          
          <div className="flex space-x-6 mt-2 md:mt-0">
            <Link to="/terms" className="text-xs text-foreground/70 hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-foreground/70 hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-xs text-foreground/70 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter; 