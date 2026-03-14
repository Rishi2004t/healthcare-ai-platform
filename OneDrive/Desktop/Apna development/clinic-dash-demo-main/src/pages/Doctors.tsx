import React, { useState, useEffect } from 'react';
import { Stethoscope, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DoctorCard from '@/components/DoctorCard';
import { doctorApi } from '@/lib/api';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  available: boolean;
  type: 'general' | 'specialist';
}

const Doctors: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'general' | 'specialist'>('all');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorApi.getDoctors();
        const mapped = response.data.map((doc: any) => ({
          id: doc.id,
          name: doc.full_name || 'Medical Professional',
          specialty: doc.email.includes('doc') ? 'Specialist' : 'General Physician',
          rating: 4.5 + Math.random() * 0.5,
          experience: '10+ years exp.',
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.full_name}`,
          available: true,
          type: doc.email.includes('specialist') ? 'specialist' : 'general',
        }));
        setDoctors(mapped);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    if (filter === 'all') return true;
    return doctor.type === filter;
  });

  return (
    <div className="page-transition min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Stethoscope className="h-4 w-4" />
            <span>Our Medical Team</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Doctors
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team of certified healthcare professionals is ready to provide you
            with the best medical care. Choose a doctor and book your consultation.
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="rounded-full"
          >
            All Doctors
          </Button>
          <Button
            variant={filter === 'general' ? 'default' : 'outline'}
            onClick={() => setFilter('general')}
            className="rounded-full"
          >
            General
          </Button>
          <Button
            variant={filter === 'specialist' ? 'default' : 'outline'}
            onClick={() => setFilter('specialist')}
            className="rounded-full"
          >
            Specialist
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading our medical professionals...</p>
          </div>
        ) : (
          <>
            {/* Doctors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DoctorCard
                    name={doctor.name}
                    specialty={doctor.specialty}
                    rating={parseFloat(doctor.rating.toFixed(1))}
                    experience={doctor.experience}
                    image={doctor.image}
                    available={doctor.available}
                  />
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No doctors found for this filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Doctors;
