import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <article className="prose prose-invert prose-lg max-w-none">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-8">
              YAAP Documentation
            </h1>
            
            <div className="bg-surface rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Getting Started</h2>
              
              <p className="text-muted-foreground mb-6">
                To get started with Android, you'll need to get familiar with{" "}
                <a 
                  href="http://source.android.com/source/using-repo.html" 
                  className="text-primary hover:text-primary-light transition-smooth underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Git and Repo
                </a>.
              </p>

              <p className="text-muted-foreground mb-4">
                To initialize your local repository using the YAAP trees, use a command like this:
              </p>

              <div className="bg-background rounded-md p-4 mb-6 border border-border">
                <code className="text-accent font-mono text-sm">
                  repo init -u https://github.com/yaap/manifest.git -b sixteen --git-lfs
                </code>
              </div>

              <p className="text-muted-foreground mb-4">Then to sync up:</p>

              <div className="bg-background rounded-md p-4 mb-8 border border-border">
                <code className="text-accent font-mono text-sm">
                  repo sync -j$(nproc --all) --no-tags --no-clone-bundle --current-branch
                </code>
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-6">Building the Source</h2>

              <p className="text-muted-foreground mb-4">
                The source at YAAP is well configured for building.
              </p>

              <div className="bg-background rounded-md p-4 border border-border">
                <code className="text-accent font-mono text-sm">
                  source build/envsetup.sh<br />
                  lunch yaap_device-user && m yaap
                </code>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}