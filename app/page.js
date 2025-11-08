import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Stats from '../components/landing/Stats';
import BloodTypes from '../components/landing/BloodTypes';
import CTA from '../components/landing/CTA';

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