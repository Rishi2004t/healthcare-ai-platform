import React, { useState } from 'react';
import { Apple, Loader2, ClipboardCheck, ArrowRight, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { healthApi } from '@/lib/api';
import { toast } from 'sonner';

interface DietPlanProps {
    reportData?: any;
}

const DietPlan: React.FC<DietPlanProps> = ({ reportData }) => {
    const [loading, setLoading] = useState(false);
    const [dietPlan, setDietPlan] = useState<any>(null);

    const fetchDietPlan = async () => {
        if (!reportData) {
            toast.error('No health data found to generate diet plan.');
            return;
        }
        setLoading(true);
        try {
            const response = await healthApi.getDietPlan(reportData);
            setDietPlan(response.data);
        } catch (error) {
            console.error('Failed to fetch diet plan:', error);
            toast.error('Failed to generate diet plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 bg-card border border-border rounded-2xl shadow-card overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                        <Apple className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">AI Diet Recommender</h3>
                        <p className="text-sm text-muted-foreground">Get personalized nutritional advice</p>
                    </div>
                </div>
            </div>

            {!dietPlan ? (
                <div className="text-center py-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Based on your last symptoms and body metrics, we can generate a
                        customized diet plan to help you recover faster.
                    </p>
                    <Button
                        onClick={fetchDietPlan}
                        disabled={loading}
                        className="rounded-xl gradient-hero gap-2"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
                        Generate My Diet Plan
                    </Button>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dietPlan.recommendations?.diet?.map((item: string, idx: number) => (
                            <div key={idx} className="p-3 bg-muted/50 rounded-xl border border-border/50 flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                                <p className="text-sm">{item}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Expert Health Tip
                        </h4>
                        <p className="text-sm text-muted-foreground italic">
                            "Consistency is key to recovery. Follow this plan for 7-10 days for best results."
                        </p>
                    </div>

                    <Button variant="ghost" className="w-full text-xs gap-1" onClick={() => setDietPlan(null)}>
                        Reset Recommendation
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default DietPlan;
