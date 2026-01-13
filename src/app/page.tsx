'use client';

import { useState } from 'react';
import {
  HeroSection,
  ServicesSection,
  HowItWorksSection,
  UncleProfilesSection,
  FinalCTASection,
  FounderStoryModal,
} from '@/components/landing';
import { Header, BottomNav } from '@/components/layout';

export default function Home() {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <>
      <Header />

      <main className="pb-16 md:pb-0">
        {/* Section 0: Hero */}
        <HeroSection onOpenStoryModal={() => setIsStoryModalOpen(true)} />

        {/* Section 0.5: Services */}
        <ServicesSection />

        {/* Section 1: How It Works */}
        <HowItWorksSection />

        {/* Section 1.5: Uncle Profiles */}
        <UncleProfilesSection />

        {/* Section 3: Final CTA */}
        <FinalCTASection />
      </main>

      <BottomNav />

      {/* Founder Story Modal */}
      <FounderStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />
    </>
  );
}
