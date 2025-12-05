import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Stats from '../components/landing/Stats';
import BloodTypes from '../components/landing/BloodTypes';
import CTA from '../components/landing/CTA';

// Page-specific SEO metadata
export const metadata = {
  title: 'BloodConnect - Save Lives Through Blood Donation',
  description: 'Join Lupang Pangako\'s community blood donation platform. Register as a donor, find compatible blood types, and help save lives in your barangay.',
  keywords: ['blood donation', 'blood donor', 'Lupang Pangako', 'barangay health', 'blood bank', 'donate blood'],
  openGraph: {
    title: 'BloodConnect - Save Lives Through Blood Donation',
    description: 'Join Lupang Pangako\'s community blood donation platform. Register as a donor and help save lives.',
    url: '/',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <Navbar role="public" />
      
      <main className="min-h-screen">
        <Hero />
        <Features />
        <Stats />
        <BloodTypes />
        <CTA />
      </main>

      <Footer />
    </>
  );
}