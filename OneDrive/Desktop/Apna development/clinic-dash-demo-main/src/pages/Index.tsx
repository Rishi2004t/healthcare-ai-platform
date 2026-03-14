import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Calendar, Shield, Clock, Zap, HeartPulse, Stethoscope, Video, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FeatureCard from '@/components/FeatureCard';
import AppointmentHistory from '@/components/AppointmentHistory';
import AccessibilityControls from '@/components/AccessibilityControls';
import { DashboardCardSkeleton } from '@/components/SkeletonLoader';
import DoctorAvatarStatus from '@/components/DoctorAvatarStatus';
import HealthTipBubble from '@/components/HealthTipBubble';
// Doctor Image Import
import doctorHeroImage from '@/assets/doctor-hero.png';
import { useReports } from '@/contexts/ReportContext';
import DietPlan from '@/components/DietPlan';

const features = [
  {
    icon: Clock,
    title: '24/7 AI Chat Support',
    description: 'Get instant answers to your health queries anytime, anywhere with our intelligent chatbot.',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Consultation',
    description: 'Connect with certified healthcare professionals for personalized medical advice.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is protected with enterprise-grade encryption and privacy controls.',
  },
  {
    icon: Zap,
    title: 'Fast Response',
    description: 'Get quick responses from our AI and healthcare providers within minutes.',
  },
];

const Index: React.FC = () => {
  // Loading Skeleton State
  const [isLoading, setIsLoading] = useState(true);
  const { reports } = useReports();

  // Latest report data for diet plan
  const latestReport = reports.length > 0 ? reports[0].data : null;

  // Scroll Animation - Intersection Observer
  const doctorCardRef = useRef<HTMLDivElement>(null);
  const appointmentRef = useRef<HTMLDivElement>(null);
  const accessibilityRef = useRef<HTMLDivElement>(null);

  // Simulate loading with setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (doctorCardRef.current) observer.observe(doctorCardRef.current);
    if (appointmentRef.current) observer.observe(appointmentRef.current);
    if (accessibilityRef.current) observer.observe(accessibilityRef.current);

    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <div className="page-transition">
      {/* Doctor Avatar Status - Floating Indicator */}
      <DoctorAvatarStatus />

      {/* Health Tip Floating Bubble */}
      <HealthTipBubble />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <HeartPulse className="h-4 w-4" />
              <span>AI-Powered Healthcare Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
              Your Health,{' '}
              <span className="text-transparent bg-clip-text gradient-hero">
                Our Priority
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Experience the future of healthcare with our AI-powered chatbot and
              seamless doctor consultations. Get instant health guidance 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/chat" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Start Chat
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/appointments" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Dashboard Card Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Dashboard Style Card with Doctor Image */}
            {isLoading ? (
              <DashboardCardSkeleton />
            ) : (
              <Card
                ref={doctorCardRef}
                className="scroll-animate p-6 bg-card border border-border rounded-2xl shadow-card"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Circular Doctor Image with Availability Indicator */}
                  <div className="relative mb-4">
                    <img
                      src={doctorHeroImage}
                      alt="Our Medical Professionals"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover object-top border-4 border-primary/20 shadow-soft"
                    />
                    {/* Doctor Availability Indicator - Green = Available */}
                    <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-card animate-pulse-soft" title="Available" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-md">
                      <Star className="h-4 w-4 text-accent-foreground fill-current" />
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <h3 className="text-xl font-bold text-foreground mb-1">Dr. Healthcare Team</h3>
                  <p className="text-primary font-medium text-sm mb-2">General & Specialist Physicians</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Certified professionals with 10+ years of experience
                  </p>

                  {/* Stats */}
                  <div className="flex gap-6 text-center border-t border-border pt-4 w-full justify-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">500+</p>
                      <p className="text-xs text-muted-foreground">Patients</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">4.9</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">24/7</p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Appointment History Card */}
            {isLoading ? (
              <DashboardCardSkeleton />
            ) : (
              <div ref={appointmentRef} className="scroll-animate">
                <AppointmentHistory />
              </div>
            )}

            {/* Accessibility Controls Card */}
            {isLoading ? (
              <DashboardCardSkeleton />
            ) : (
              <div ref={accessibilityRef} className="scroll-animate">
                <AccessibilityControls />
              </div>
            )}
          </div>

          {/* New Row for AI Insights */}
          {!isLoading && latestReport && (
            <div className="mt-8 max-w-6xl mx-auto animate-fade-in">
              <DietPlan reportData={latestReport} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose MediCare?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge AI technology with compassionate healthcare
              to deliver an unparalleled patient experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to take control of your health?
                </h2>
                <p className="text-primary-foreground/80 max-w-xl">
                  Join thousands of users who trust MediCare for their healthcare needs.
                  Start your journey to better health today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero-outline" size="lg">
                  <Link to="/doctors" className="gap-2">
                    <Video className="h-5 w-5" />
                    View Doctors
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link to="/chat" className="gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
