/* Appointment History Dashboard Card */
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { consultationApi } from '@/lib/api';

type FilterType = 'upcoming' | 'past';

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  type: 'upcoming' | 'past';
}

const AppointmentHistory: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await consultationApi.getMyRequests();
        if (response.data) {
          const mapped = response.data.map((apt: any) => {
            // Parse notes for doctor name and time if possible: "Doctor: Dr. X, Time: Y Z"
            let doctorName = 'Doctor';
            let date = 'Pending';
            let time = '';

            if (apt.notes) {
              const docMatch = apt.notes.match(/Doctor: (.*?),/);
              const timeMatch = apt.notes.match(/Time: (.*)/);
              if (docMatch) doctorName = docMatch[1];
              if (timeMatch) {
                const dt = timeMatch[1].split(' ');
                date = dt[0];
                time = dt.slice(1).join(' ');
              }
            }

            return {
              id: apt.id,
              doctorName,
              specialty: 'Medical Consultation',
              date,
              time,
              status: apt.status,
              type: apt.status === 'completed' || apt.status === 'cancelled' ? 'past' : 'upcoming'
            };
          });
          setAppointments(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => apt.type === filter);

  return (
    <Card className="p-6 bg-card border border-border rounded-2xl shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">My Appointments</h3>
            <p className="text-sm text-muted-foreground">View your appointment history</p>
          </div>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex gap-2 mb-4 p-1 bg-muted rounded-xl">
        <button
          onClick={() => setFilter('upcoming')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${filter === 'upcoming'
            ? 'bg-card text-foreground shadow-soft'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${filter === 'past'
            ? 'bg-card text-foreground shadow-soft'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Past
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 animate-filter-transition">
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No {filter} appointments</p>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{apt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {apt.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${apt.status === 'confirmed' || apt.status === 'pending' ? 'bg-primary/10 text-primary' :
                    apt.status === 'completed' ? 'bg-accent/10 text-accent' :
                      'bg-destructive/10 text-destructive'
                  }`}>
                  {(apt.status === 'confirmed' || apt.status === 'pending') && <Clock className="h-3 w-3" />}
                  {apt.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                  {apt.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default AppointmentHistory;
