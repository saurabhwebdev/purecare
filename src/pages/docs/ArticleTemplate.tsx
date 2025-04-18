import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ChevronLeft, Home, BookOpen, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ArticleProps {
  title: string;
  category: string;
  categoryName: string;
  lastUpdated?: string;
}

const ArticleTemplate: React.FC<ArticleProps> = ({ 
  title = "Article Title", 
  category = "category-slug", 
  categoryName = "Category Name", 
  lastUpdated = "January 1, 2024" 
}) => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/docs" className="flex items-center gap-1 hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              <span>Docs</span>
            </Link>
            <span>/</span>
            <Link to={`/docs/${category}`} className="hover:text-foreground">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                This is a template for documentation articles. Replace this content with your actual documentation. 
                You can include various elements like paragraphs, lists, code blocks, images, and more.
              </p>
              
              <h2>Getting Started</h2>
              <p>
                This section would contain information about getting started with the feature or topic being documented.
              </p>
              
              <h3>Step 1: Initial Setup</h3>
              <p>
                Detailed instructions for the first step in the process.
              </p>
              
              <h3>Step 2: Configuration</h3>
              <p>
                Information about how to configure the feature.
              </p>
              
              <div className="bg-muted p-4 rounded-md my-4">
                <p className="font-medium">Note</p>
                <p className="text-sm text-muted-foreground">
                  Important information that users should be aware of can be highlighted in note boxes like this.
                </p>
              </div>
              
              <h2>Usage Examples</h2>
              <p>
                This section would contain examples of how to use the feature or functionality.
              </p>
              
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Example code
function exampleFunction() {
  return "This is an example code block";
}`}
                </code>
              </pre>
              
              <h2>Troubleshooting</h2>
              <p>
                Common issues and their solutions would be listed in this section.
              </p>
              
              <ul>
                <li>Issue 1: Description and solution</li>
                <li>Issue 2: Description and solution</li>
                <li>Issue 3: Description and solution</li>
              </ul>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Related Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-primary hover:underline flex items-center">
                    <span>Related Article 1</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-primary hover:underline flex items-center">
                    <span>Related Article 2</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-primary hover:underline flex items-center">
                    <span>Related Article 3</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link to="/docs">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Docs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleTemplate; 