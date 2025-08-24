import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

// Mock data - in a real app, this would come from an API
const mockPosts = [
  {
    id: 1,
    title: "YAAP 14.0 Release: Major Updates and New Features",
    excerpt: "We're excited to announce the release of YAAP 14.0, bringing enhanced security, improved performance, and new customization options to your devices.",
    date: "2025-01-15",
    author: "YAAP Team",
    slug: "yaap-14-release"
  },
  {
    id: 2,
    title: "Expanding Device Support: 20 New Devices Added",
    excerpt: "This month we've added support for 20 new devices across various OEMs, making YAAP accessible to even more users worldwide.",
    date: "2025-01-08",
    author: "Device Team",
    slug: "new-device-support-january"
  }
];

export function LatestNews() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <section className="py-20 px-4 bg-gradient-surface">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Latest News
          </h2>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest YAAP developments
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {mockPosts.map((post) => (
            <Card key={post.id} className="gradient-surface border-border hover:shadow-card transition-smooth group">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <time>{formatDate(post.date)}</time>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-accent transition-smooth">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
                
                <Button 
                  variant="ghost" 
                  className="text-accent hover:text-accent-foreground hover:bg-accent p-0 h-auto group/btn"
                >
                  Read more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
          >
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  );
}