import React, { useEffect, useState } from 'react';
import { consultationApi } from '@/lib/api';
import { toast } from 'sonner';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, Calendar, User, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MyConsultations: React.FC = () => {
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await consultationApi.getMyRequests();
                setConsultations(response.data);
            } catch (error) {
                toast.error('Failed to fetch consultations');
            } finally {
                setLoading(false);
            }
        };
        fetchConsultations();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] py-12 px-4 bg-muted/30">
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Consultations</h1>
                        <p className="text-muted-foreground">Track your medical consultation history and advice</p>
                    </div>
                    <Button asChild className="rounded-xl gradient-hero shadow-soft">
                        <Link to="/consultation-request" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            New Consultation
                        </Link>
                    </Button>
                </div>

                {consultations.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-soft">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                            <MessageSquare className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No Consultations Yet</h2>
                        <p className="text-muted-foreground mb-8">You haven't requested any medical consultations yet.</p>
                        <Button asChild className="rounded-xl h-12 px-8 gradient-hero">
                            <Link to="/consultation-request">Start Your First Consultation</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {consultations.map((consultation) => (
                            <Card key={consultation.id} className="rounded-2xl border-border/50 shadow-card overflow-hidden bg-card">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {new Date(consultation.created_at).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <Badge
                                        variant={consultation.status === 'completed' ? 'default' : 'secondary'}
                                        className={`rounded-full px-3 py-1 ${consultation.status === 'completed'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}
                                    >
                                        {consultation.status === 'completed' ? 'Answered' : 'Pending'}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Patient</p>
                                                <p className="text-lg font-bold flex items-center gap-2">
                                                    <User className="h-4 w-4 text-primary" />
                                                    {consultation.patient_name} <span className="text-sm font-normal text-muted-foreground">({consultation.age}y)</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Symptoms ({consultation.duration})</p>
                                                <p className="text-foreground line-clamp-3 italic">"{consultation.symptoms}"</p>
                                            </div>
                                        </div>

                                        <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                                            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Doctor Advice</p>
                                            {consultation.doctor_advice ? (
                                                <div className="space-y-3">
                                                    <p className="text-foreground font-medium italic">"{consultation.doctor_advice}"</p>
                                                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-bold">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Verified Medical Counsel
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 py-4 text-center">
                                                    <Clock className="h-8 w-8 mx-auto text-amber-500 animate-pulse mb-2" />
                                                    <p className="text-sm text-muted-foreground italic">Waiting for doctor review...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyConsultations;
