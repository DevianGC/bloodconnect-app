import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Stats from '../components/landing/Stats';
import BloodTypes from '../components/landing/BloodTypes';
import CTA from '../components/landing/CTA';
import { getPublicStats } from '../lib/db';

export const metadata = {
  title: "Home",
  description: "Join the BloodConnect network in Olongapo City. Register as a donor or request blood today.",
};

export default async function Home() {
  const stats = await getPublicStats();

  return (
    <>
      <Navbar role="public" />
      
      <main className="min-h-screen">
        <Hero />
        <Features />
        <Stats data={stats} />
        <BloodTypes />
        <CTA />
      </main>

      <Footer />
    </>
  );
}