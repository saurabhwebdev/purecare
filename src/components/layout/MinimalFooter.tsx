import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const MinimalFooter = () => {
  return (
    <footer className="bg-background/50 border-t border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-foreground/70">
            © {new Date().getFullYear()} PureCare. All rights reserved.
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6 mt-2 md:mt-0 justify-center">
            <Link to="/docs" className="text-xs text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>Documentation</span>
            </Link>
            <Link to="/terms" className="text-xs text-foreground/70 hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-foreground/70 hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-xs text-foreground/70 hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/feedback" className="text-xs text-foreground/70 hover:text-foreground transition-colors">
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter; 