import React from 'react';
import { FileText, Download, Calendar, ExternalLink, Inbox } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReports } from '@/contexts/ReportContext';

const MyReports: React.FC = () => {
    const { reports } = useReports();

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <FileText className="h-4 w-4" />
                        <span>Personal Dashboard</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        My Medical Reports
                    </h1>
                    <p className="text-muted-foreground">
                        Access and download your previous health assessment reports.
                    </p>
                </div>

                {reports.length === 0 ? (
                    <Card className="p-12 text-center bg-card border border-dashed border-border flex flex-col items-center justify-center space-y-4 rounded-2xl">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Inbox className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">No reports yet</h3>
                            <p className="text-muted-foreground">You haven't generated any medical reports yet.</p>
                        </div>
                        <Button asChild className="rounded-xl px-8">
                            <a href="#/medical-form">Start Assessment</a>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reports.map((report) => (
                            <Card
                                key={report.id}
                                className="group p-6 bg-card border border-border/50 hover:border-primary/30 shadow-card transition-all duration-300 rounded-2xl flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                            {report.id}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                            {report.data.fullName || 'Assessment Report'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(report.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-muted/30 p-3 rounded-xl">
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Symptoms</p>
                                            <p className="text-xs line-clamp-1 italic text-muted-foreground">
                                                "{report.data.symptoms}"
                                            </p>
                                        </div>
                                        {report.data.bmi && (
                                            <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 flex flex-col items-center justify-center min-w-[60px]">
                                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">BMI</p>
                                                <p className="text-sm font-black text-primary">{report.data.bmi}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <Button variant="outline" className="flex-1 rounded-xl h-10 gap-2 text-xs">
                                        <ExternalLink className="h-3 w-3" />
                                        Details
                                    </Button>
                                    <Button className="flex-1 rounded-xl h-10 gap-2 text-xs gradient-hero shadow-soft">
                                        <Download className="h-3 w-3" />
                                        PDF
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReports;
