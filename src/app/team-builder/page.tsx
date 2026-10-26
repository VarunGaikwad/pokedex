import type { Metadata } from 'next';
import TeamBuilder from '@/components/team-builder';

export const metadata: Metadata = { title: 'Team Builder | Pokédex' };

export default function TeamBuilderPage() {
  return (
    <main id="main-content" tabIndex={-1} className="field-container pb-16 pt-8 sm:pt-10">
      <header className="scenic-panel relative mb-7 overflow-hidden p-6 sm:mb-9 sm:p-9">
        <p className="device-label mb-4 flex items-center gap-2.5 text-white/80">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5 shrink-0 text-yellow-300">
            <path d="M2 12a10 10 0 0 1 20 0Z" fill="currentColor" fillOpacity="0.15" stroke="none" />
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h7m6 0h7" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Trainer terminal / Party planner
        </p>
        <h1 className="max-w-2xl text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">Build your dream team<span className="text-yellow-300">.</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">Choose your six. Plan their moves. Get ready for your next battle.</p>
      </header>
      <TeamBuilder />
    </main>
  );
}
