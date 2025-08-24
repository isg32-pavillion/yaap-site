import { Link } from "react-router-dom";

const footerLinks = {
  community: [
    { name: "Telegram chat", href: "https://t.me/yaap_community" },
    { name: "Update channel", href: "https://t.me/yaap_updates" }
  ],
  links: [
    { name: "Twitter", href: "https://twitter.com/YAAP_ROM" }
  ],
  source: [
    { name: "Github", href: "https://github.com/yaap" },
    { name: "Gitea", href: "https://git.yaap.eu/" },
    { name: "Gerrit", href: "https://gerrit.yaap.eu/" }
  ]
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-surface">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                YAAP
              </h3>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>YAAP is not affiliated with Google or Android.</p>
              <p>Copyright © 2025 YAAP</p>
              <p>
                Design & code by{" "}
                <a 
                  href="https://isg32.is-a.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light transition-smooth"
                >
                  @isg32
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Community */}
            <div>
              <h4 className="font-semibold text-accent mb-4">Community</h4>
              <ul className="space-y-2">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-accent mb-4">Links</h4>
              <ul className="space-y-2">
                {footerLinks.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Source Code */}
            <div>
              <h4 className="font-semibold text-accent mb-4">Source code</h4>
              <ul className="space-y-2">
                {footerLinks.source.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}