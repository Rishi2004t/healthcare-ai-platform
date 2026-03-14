import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { consultationApi, doctorApi } from '@/lib/api';
import { toast } from 'sonner';



const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];

const Appointments: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [doctorsList, setDoctorsList] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorApi.getDoctors();
        const names = response.data.map((doc: any) => doc.full_name || doc.email);
        setDoctorsList(names);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        toast.error('Could not load doctor list.');
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.doctor) {
      newErrors.doctor = 'Please select a doctor';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await consultationApi.request({
          doctor_name: formData.doctor,
          date: formData.date,
          time: formData.time,
          reason: formData.reason
        });
        setShowConfirmation(true);
      } catch (error: any) {
        console.error('Booking failed:', error);
        toast.error(error.response?.data?.detail || 'Failed to book appointment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      doctor: '',
      date: '',
      time: '',
      reason: '',
    });
    setErrors({});
    setShowConfirmation(false);
  };

  return (
    <div className="page-transition min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            <span>Schedule Consultation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to schedule your consultation with our healthcare professionals.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl bg-card border border-border/50 shadow-card p-6 md:p-8 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className={`h-12 rounded-xl ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                className={`h-12 rounded-xl ${errors.phone ? 'border-destructive' : ''}`}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Doctor */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Select Doctor
              </Label>
              <Select
                value={formData.doctor}
                onValueChange={(value) => setFormData({ ...formData, doctor: value })}
                disabled={fetchingDoctors}
              >
                <SelectTrigger className={`h-12 rounded-xl ${errors.doctor ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder={fetchingDoctors ? "Loading doctors..." : "Choose a doctor"} />
                </SelectTrigger>
                <SelectContent>
                  {doctorsList.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctor && (
                <p className="text-sm text-destructive">{errors.doctor}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={`h-12 rounded-xl ${errors.date ? 'border-destructive' : ''}`}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Time Slot
                </Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                >
                  <SelectTrigger className={`h-12 rounded-xl ${errors.time ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Reason for Visit (Optional)
              </Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Briefly describe your symptoms or reason for consultation..."
                className="min-h-[100px] rounded-xl resize-none"
              />
            </div>
          </div>

          <Button type="submit" variant="hero" size="xl" className="w-full">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </Button>
        </form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-xl">Appointment Booked!</DialogTitle>
              <DialogDescription className="text-center">
                Your appointment has been successfully scheduled.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Patient</span>
                <span className="font-medium text-foreground">{formData.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium text-foreground">{formData.doctor.split(' - ')[0]}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {formData.date && new Date(formData.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{formData.time}</span>
              </div>
            </div>

            <Button onClick={handleReset} className="w-full">
              Book Another Appointment
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Appointments;
