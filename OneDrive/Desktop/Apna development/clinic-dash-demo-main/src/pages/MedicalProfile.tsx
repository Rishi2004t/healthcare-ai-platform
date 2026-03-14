import React, { useEffect, useState } from 'react';
import { profileApi } from '@/lib/api';
import { toast } from 'sonner';
import { User, ActivitySquare, ClipboardList, MapPin, Phone, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MedicalProfile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileApi.get();
                setProfile(data);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    toast.info('No medical profile found. Please create one.');
                } else {
                    toast.error('Failed to fetch medical profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto max-w-2xl py-20 px-4 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                    <ClipboardList className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4">No Profile Found</h1>
                <p className="text-muted-foreground mb-8">
                    You haven't created a medical profile yet. Create one to help us provide better care.
                </p>
                <Button asChild className="rounded-xl h-12 px-8 gradient-hero">
                    <Link to="/medical-form">Create Medical Profile</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Medical Profile</h1>
                    <p className="text-muted-foreground">Stored health details from your assessment</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Basic Info */}
                    <Card className="rounded-2xl border-border/50 shadow-card">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="text-xl">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Full Name</p>
                                    <p className="font-bold text-lg">{profile.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Age / Gender</p>
                                    <p className="font-bold text-lg">{profile.age} / <span className="capitalize">{profile.gender}</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Blood Group</p>
                                    <p className="font-bold text-lg">{profile.blood_group}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Physical Metrics */}
                    <Card className="rounded-2xl border-border/50 shadow-card">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <Heart className="h-5 w-5 text-primary" />
                            <CardTitle className="text-xl">Physical Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 pt-4 text-center">
                                <div className="bg-muted/30 p-4 rounded-xl">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Height</p>
                                    <p className="text-2xl font-bold text-primary">{profile.height} cm</p>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-xl">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Weight</p>
                                    <p className="text-2xl font-bold text-primary">{profile.weight} kg</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clinical Details */}
                    <Card className="rounded-2xl border-border/50 shadow-card">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <ActivitySquare className="h-5 w-5 text-primary" />
                            <CardTitle className="text-xl">Clinical Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Current Symptoms</p>
                                <p className="bg-muted/30 p-4 rounded-xl italic">"{profile.symptoms}"</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Existing Diseases</p>
                                    <p className="font-medium">{profile.existing_diseases || 'None'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Current Medications</p>
                                    <p className="font-medium">{profile.medications || 'None'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal & Privacy */}
                    <Card className="rounded-2xl border-border/50 shadow-card">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <CardTitle className="text-xl">Personal & Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Home Address</p>
                                <p className="flex items-start gap-2">
                                    <span>{profile.address}</span>
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Emergency Contact</p>
                                <p className="flex items-center gap-2 font-bold text-lg">
                                    <Phone className="h-4 w-4 text-primary" />
                                    {profile.emergency_contact}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="pt-4 flex justify-center">
                        <Button asChild variant="outline" className="rounded-xl h-12 px-8">
                            <Link to="/medical-form">Update Profile Info</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalProfile;
