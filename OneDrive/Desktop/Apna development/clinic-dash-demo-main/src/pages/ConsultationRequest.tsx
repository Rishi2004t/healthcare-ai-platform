import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, User, Calendar, MessageSquare, Upload, CheckCircle2, ChevronRight } from 'lucide-react';
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

const ConsultationRequest: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingDoctors, setFetchingDoctors] = useState(true);
    const [doctorsList, setDoctorsList] = useState<any[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        symptoms: '',
        duration: '',
        doctorName: '',
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await doctorApi.getDoctors();
                setDoctorsList(response.data);
            } catch (error) {
                toast.error('Failed to load doctors list');
            } finally {
                setFetchingDoctors(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.patientName || !formData.age || !formData.symptoms || !formData.duration || !formData.doctorName) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await consultationApi.request({
                patient_name: formData.patientName,
                age: parseInt(formData.age),
                symptoms: formData.symptoms,
                duration: formData.duration,
                doctor_name: formData.doctorName,
                medical_report_path: null // Placeholder for now
            });
            setShowSuccess(true);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to submit consultation request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <MessageSquare className="h-4 w-4" />
                        <span>Doctor Consultation</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Request a Consultation
                    </h1>
                    <p className="text-muted-foreground">
                        Describe your medical issue and a professional doctor will review it and provide advice.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl bg-card border border-border/50 shadow-card p-6 md:p-8 space-y-6">
                        {/* Patient Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="patientName">Patient Name</Label>
                                <Input
                                    id="patientName"
                                    placeholder="Enter patient name"
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="Years"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div className="space-y-2">
                            <Label htmlFor="symptoms">Symptoms / Problem Description</Label>
                            <Textarea
                                id="symptoms"
                                placeholder="Please describe your symptoms or medical issue in detail..."
                                value={formData.symptoms}
                                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                className="min-h-[120px] rounded-xl resize-none"
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration of problem</Label>
                            <Input
                                id="duration"
                                placeholder="e.g. 2 days, 1 week"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>

                        {/* Doctor Selection */}
                        <div className="space-y-2">
                            <Label>Select Doctor</Label>
                            <Select
                                value={formData.doctorName}
                                onValueChange={(value) => setFormData({ ...formData, doctorName: value })}
                            >
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue placeholder={fetchingDoctors ? "Loading..." : "Choose a doctor"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctorsList.map((doc) => (
                                        <SelectItem key={doc.id} value={doc.full_name}>
                                            {doc.full_name} ({doc.specialization || 'General'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* File Upload Placeholder */}
                        <div className="space-y-2">
                            <Label>Attach Medical Report (Optional)</Label>
                            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Click to upload or drag and drop PDF/Images</p>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gradient-hero shadow-soft" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Consultation Request'}
                    </Button>
                </form>

                <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                            <DialogTitle className="text-2xl font-bold">Request Submitted!</DialogTitle>
                            <DialogDescription className="text-center pt-2">
                                Your consultation request has been sent to the doctor.
                                You will be notified once they provide advice.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 mt-4">
                            <Button onClick={() => navigate('/my-consultations')} className="rounded-xl h-12">
                                View My Consultations
                            </Button>
                            <Button variant="ghost" onClick={() => setShowSuccess(false)} className="rounded-xl h-12">
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ConsultationRequest;
