import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FileText,
    User,
    Activity,
    ActivitySquare,
    Clock,
    Moon,
    CheckCircle2,
    Download,
    ClipboardList
} from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { useReports, MedicalReport } from '@/contexts/ReportContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    age: z.coerce.number().min(1, 'Age is required').max(120),
    gender: z.string().min(1, 'Gender is required'),
    bloodGroup: z.string().min(1, 'Blood group is required'),
    height: z.coerce.number().min(1, 'Height is required'),
    weight: z.coerce.number().min(1, 'Weight is required'),
    symptoms: z.string().min(5, 'Symptoms description is required'),
    existingDiseases: z.string().optional(),
    medications: z.string().optional(),
    emergencyContact: z.string().min(2, 'Emergency contact is required'),
    address: z.string().min(5, 'Address is required'),
});

type FormValues = z.infer<typeof formSchema>;

const PatientForm: React.FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentReportId, setCurrentReportId] = useState('');
    const { addReport } = useReports();
    const reportRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            smoking: 'no',
            alcohol: 'no',
            gender: '',
            bloodGroup: '',
            activityLevel: 'moderate',
            painLevel: 5,
        }
    });

    const genderValue = watch('gender');
    const smokingValue = watch('smoking');
    const alcoholValue = watch('alcohol');
    const bloodGroupValue = watch('bloodGroup');
    const activityLevelValue = watch('activityLevel');

    // Auto-calculate BMI
    const height = watch('height');
    const weight = watch('weight');
    const bmi = React.useMemo(() => {
        if (height && weight) {
            const h = height / 100;
            return parseFloat((weight / (h * h)).toFixed(1));
        }
        return 0;
    }, [height, weight]);

    const generatePDF = async (data: FormValues, reportId: string, bmiValue: number) => {
        if (!reportRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                logging: false,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Medical_Report_${reportId}.pdf`);

            return true;
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate PDF. Please try again.');
            return false;
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsGenerating(true);
        try {
            // Map frontend fields to backend ProfileCreate schema
            const profileData = {
                name: data.fullName,
                age: data.age,
                gender: data.gender,
                height: data.height,
                weight: data.weight,
                blood_group: data.bloodGroup,
                symptoms: data.symptoms,
                existing_diseases: data.existingDiseases || 'None',
                medications: data.medications || 'None',
                emergency_contact: data.emergencyContact,
                address: data.address,
            };

            await profileApi.create(profileData);

            toast.success('Patient profile saved successfully');
            reset();
            navigate('/'); // Redirect to Dashboard
        } catch (error: any) {
            console.error('Submission failed:', error);
            if (error.response?.status === 400 && error.response?.data?.detail === "Profile already exists. Use PUT to update.") {
                // Try to update if it exists
                try {
                    const profileData = {
                        name: data.fullName,
                        age: data.age,
                        gender: data.gender,
                        height: data.height,
                        weight: data.weight,
                        blood_group: data.bloodGroup,
                        symptoms: data.symptoms,
                        existing_diseases: data.existingDiseases || 'None',
                        medications: data.medications || 'None',
                        emergency_contact: data.emergencyContact,
                        address: data.address,
                    };
                    await profileApi.update(profileData);
                    toast.success('Patient profile updated successfully');
                    reset();
                    navigate('/');
                    return;
                } catch (updateError: any) {
                    toast.error(updateError.message || 'Failed to update profile');
                }
            }
            toast.error(error.response?.data?.detail || 'Failed to save profile. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] py-8 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <ClipboardList className="h-4 w-4" />
                        <span>Health Assessment</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Patient Medical Form
                    </h1>
                    <p className="text-muted-foreground">
                        Please provide accurate information for a comprehensive medical assessment.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* 1. Basic Information */}
                    <div className="space-y-4 p-6 md:p-8 bg-card border border-border/50 shadow-card rounded-2xl">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <User className="h-5 w-5 text-primary" />
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    {...register('fullName')}
                                    className={`h-12 rounded-xl border-border bg-muted/30 ${errors.fullName ? 'border-destructive' : ''}`}
                                />
                                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="Years"
                                    {...register('age')}
                                    className={`h-12 rounded-xl border-border bg-muted/30 ${errors.age ? 'border-destructive' : ''}`}
                                />
                                {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select onValueChange={(value) => setValue('gender', value)} value={genderValue}>
                                    <SelectTrigger className={`h-12 rounded-xl border-border bg-muted/30 ${errors.gender ? 'border-destructive' : ''}`}>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Blood Group</Label>
                                <Select onValueChange={(value) => setValue('bloodGroup', value)} value={bloodGroupValue}>
                                    <SelectTrigger className={`h-12 rounded-xl border-border bg-muted/30 ${errors.bloodGroup ? 'border-destructive' : ''}`}>
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.bloodGroup && <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* 2. Physical Metrics */}
                    <div className="space-y-4 p-6 md:p-8 bg-card border border-border/50 shadow-card rounded-2xl">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <ActivitySquare className="h-5 w-5 text-primary" />
                            Physical Metrics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    placeholder="cm"
                                    {...register('height')}
                                    className={`h-12 rounded-xl border-border bg-muted/30 ${errors.height ? 'border-destructive' : ''}`}
                                />
                                {errors.height && <p className="text-xs text-destructive">{errors.height.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    placeholder="kg"
                                    {...register('weight')}
                                    className={`h-12 rounded-xl border-border bg-muted/30 ${errors.weight ? 'border-destructive' : ''}`}
                                />
                                {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* 3. Health & Address */}
                    <div className="space-y-4 p-6 md:p-8 bg-card border border-border/50 shadow-card rounded-2xl">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            Clinical Details
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="symptoms">Main Symptoms</Label>
                                <Textarea
                                    id="symptoms"
                                    placeholder="Describe your current symptoms..."
                                    {...register('symptoms')}
                                    className={`min-h-[100px] rounded-xl border-border bg-muted/30 ${errors.symptoms ? 'border-destructive' : ''}`}
                                />
                                {errors.symptoms && <p className="text-xs text-destructive">{errors.symptoms.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Enter your full home address"
                                    {...register('address')}
                                    className={`h-12 rounded-xl border-border bg-muted/30 ${errors.address ? 'border-destructive' : ''}`}
                                />
                                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* 4. Medical History & Emergency */}
                    <div className="space-y-4 p-6 md:p-8 bg-card border border-border/50 shadow-card rounded-2xl">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-primary" />
                            Medical History & Emergency
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="existingDiseases">Existing Diseases</Label>
                                    <Input
                                        id="existingDiseases"
                                        placeholder="Diabetes, Asthma, etc."
                                        {...register('existingDiseases')}
                                        className="h-12 rounded-xl border-border bg-muted/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                    <Input
                                        id="emergencyContact"
                                        placeholder="Name & Phone Number"
                                        {...register('emergencyContact')}
                                        className={`h-12 rounded-xl border-border bg-muted/30 ${errors.emergencyContact ? 'border-destructive' : ''}`}
                                    />
                                    {errors.emergencyContact && <p className="text-xs text-destructive">{errors.emergencyContact.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medications">Current Medications</Label>
                                <Input
                                    id="medications"
                                    placeholder="List any medicines you're currently taking"
                                    {...register('medications')}
                                    className="h-12 rounded-xl border-border bg-muted/30"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl text-lg font-bold gradient-hero shadow-soft transition-all active:scale-[0.98]"
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2 animate-pulse">
                                <Download className="h-5 w-5" />
                                Generating PDF...
                            </span>
                        ) : (
                            'Submit & Generate Medical Report'
                        )}
                    </Button>
                </form>

                {/* Success Modal */}
                <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                            <DialogTitle className="text-2xl">Report Generated!</DialogTitle>
                            <DialogDescription className="text-center pt-2">
                                Your medical assessment has been completed successfully.
                                The PDF report has been downloaded to your device.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted/50 p-4 rounded-xl text-center space-y-1 my-4">
                            <p className="text-sm text-muted-foreground">Unique Report ID</p>
                            <p className="font-mono text-lg font-bold text-primary">{currentReportId}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button asChild onClick={() => setShowSuccess(false)} className="rounded-xl h-12">
                                <a href="#/my-reports">View All My Reports</a>
                            </Button>
                            <Button variant="ghost" onClick={() => setShowSuccess(false)} className="rounded-xl h-12">
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Hidden Report Template for PDF Capture */}
                <div className="fixed -left-[2000px] top-0 pointer-events-none">
                    <div
                        ref={reportRef}
                        className="w-[800px] p-12 bg-white text-gray-900 font-sans"
                        style={{ minHeight: '1100px' }}
                    >
                        <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-8">
                            <div>
                                <h1 className="text-4xl font-bold text-primary mb-2">MediCare Official Report</h1>
                                <p className="text-gray-500 font-medium">Comprehensive Health Assessment</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-primary">Assessment ID: {currentReportId}</p>
                                <p className="text-gray-500 font-medium">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* 1. Basic Information */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">I. Basic Information</h2>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                    <p className="text-lg font-bold">{watch('fullName')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Age / Gender</p>
                                    <p className="text-lg font-bold">{watch('age')} Years / <span className="capitalize">{watch('gender')}</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Blood Group</p>
                                    <p className="text-lg font-bold">{watch('bloodGroup')}</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Body Metrics */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">II. Body Metrics</h2>
                            <div className="grid grid-cols-3 gap-x-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Height</p>
                                    <p className="text-xl font-bold">{watch('height')} cm</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                                    <p className="text-xl font-bold">{watch('weight')} kg</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                                        <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">BMI Score</p>
                                        <p className="text-2xl font-black text-primary">{bmi}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Health Complaint */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">III. Primary Complaint</h2>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-h-[120px]">
                                <p className="text-lg font-bold mb-2">Detailed Symptoms:</p>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap italic">"{watch('symptoms')}"</p>
                                <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                                        <p className="font-bold">{watch('duration')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Pain Level (1-10)</p>
                                        <p className="text-xl font-black text-red-600">{watch('painLevel')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Medical History */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">IV. Medical History</h2>
                            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 font-medium">Existing Diseases:</span>
                                    <span className="font-bold">{watch('diseases') || 'None reported'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 font-medium">Previous Surgeries:</span>
                                    <span className="font-bold">{watch('surgeries') || 'None reported'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Current Medications:</span>
                                    <span className="font-bold">{watch('medications') || 'None reported'}</span>
                                </div>
                            </div>
                        </div>

                        {/* 5. Lifestyle & Emergency */}
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div>
                                <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">V. Lifestyle</h2>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Activity:</span>
                                        <span className="font-bold capitalize">{watch('activityLevel')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Sleep:</span>
                                        <span className="font-bold">{watch('sleep')} hrs/day</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Smoking:</span>
                                        <span className={`font-bold ${watch('smoking') === 'yes' ? 'text-red-500' : 'text-green-600'}`}>{watch('smoking')?.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Alcohol:</span>
                                        <span className={`font-bold ${watch('alcohol') === 'yes' ? 'text-red-500' : 'text-green-600'}`}>{watch('alcohol')?.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">VI. Emergency Info</h2>
                                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 space-y-4">
                                    <div>
                                        <p className="text-xs text-primary/60 uppercase tracking-widest mb-1">Primary Contact</p>
                                        <p className="text-lg font-bold text-primary">{watch('emergencyContactName')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-primary/60 uppercase tracking-widest mb-1">Contact Phone</p>
                                        <p className="text-lg font-bold text-primary">{watch('emergencyContactPhone')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-10 border-t-2 border-primary/30">
                            <div className="flex justify-between items-center opacity-60">
                                <div>
                                    <p className="text-sm font-bold text-primary">MediCare Wellness Systems</p>
                                    <p className="text-xs">Digital assessment report generated via patient input. Not a substitute for clinical diagnosis.</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-gray-100 px-3 py-1 rounded text-[10px] font-mono mb-1">CERTIFIED SECURE SYSTEM</div>
                                    <p className="text-[10px] font-mono">REP_REF_{currentReportId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientForm;
