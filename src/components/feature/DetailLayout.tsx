
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetailSection {
  /** Remix-icon class, e.g. "ri-wifi-line" */
  icon: string;
  title: string;
  text: string;
}

export interface DetailLayoutProps {
  /** Page hero title (h2) */
  title: string;
  /** Subdued subtitle line shown in yellow under the title */
  subtitle: string;
  /** Short descriptive paragraph below the subtitle */
  description: string;
  /** Editorial sections rendered inside the translucent container */
  sections: DetailSection[];
  /** Where the ← back button in PageHeader points to */
  backTo?: string;
  /** Label for the ← back button */
  backLabel?: string;
  /** Optional Remix-icon class for the hero icon bubble */
  heroIcon?: string;
  /** Optional accent colour for the hero icon bubble (CSS hex/hsl) */
  heroIconColor?: string;
  /** Optional container section label (shown above the sections list) */
  containerLabel?: string;
  /** Optional Remix-icon class for the container label line */
  containerLabelIcon?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DetailLayout = ({
  title,
  subtitle,
  description,
  sections,
  backTo = '/',
  backLabel = 'Voltar',
  heroIcon,
  heroIconColor = '#1a5276',
  containerLabel,
  containerLabelIcon = 'ri-article-line',
}: DetailLayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <PageHeader isScrolled={isScrolled} backTo={backTo} backLabel={backLabel} />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-md mx-auto pt-8 pb-16">

        {/* Hero */}
        <div className="px-4 mb-10 text-center">
          {heroIcon && (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
              style={{ backgroundColor: `${heroIconColor}b3` }}
            >
              <i className={`${heroIcon} text-white text-3xl`} />
            </div>
          )}

          <h2 className="text-white font-bold text-3xl mb-2 drop-shadow-2xl leading-tight">
            {title}
          </h2>

          <p className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3 drop-shadow-md">
            {subtitle}
          </p>

          <p className="text-white/90 text-base drop-shadow-lg leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Translucent editorial container */}
        <div className="px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/25 shadow-2xl overflow-hidden">

            {/* Optional container label */}
            {containerLabel && (
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                  <i className={`${containerLabelIcon} text-yellow-400 text-sm`} />
                  {containerLabel}
                </h3>
              </div>
            )}

            {/* Editorial sections */}
            {sections.map((section, index) => (
              <div key={`${section.title}-${index}`}>
                {/* Divider between sections */}
                {(index > 0 || containerLabel) && (
                  <div className="mx-6 border-t border-white/15" />
                )}

                <div className="px-6 py-5">
                  {/* Icon + Title row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <i className={`${section.icon} text-white text-base`} />
                    </div>
                    <h4 className="text-white font-bold text-base leading-tight drop-shadow-sm">
                      {section.title}
                    </h4>
                  </div>

                  {/* Paragraph text */}
                  <p className="text-white/80 text-sm leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}

            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* ── Scroll-to-top button ────────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-4 z-20">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Voltar ao topo"
        >
          <i className="ri-arrow-up-line text-white text-lg" />
        </button>
      </div>

      {/* ── Back to Home Link ────────────────────────────────────────────── */}
      <div className="px-4 mb-6">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-white/70 hover:text-white text-sm transition-colors py-2"
        >
          <i className="ri-arrow-left-line" />
          Voltar para o Guia
        </Link>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <PageFooter />
    </div>
  );
};

export default DetailLayout;
