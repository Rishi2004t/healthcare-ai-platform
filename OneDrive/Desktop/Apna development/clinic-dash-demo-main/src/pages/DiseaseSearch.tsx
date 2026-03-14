import React, { useState, useEffect } from 'react';
import { Search, Activity, Pill, AlertTriangle, Info, ChevronRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { diseaseApi, medicineApi } from '@/lib/api';
import { toast } from 'sonner';

const DiseaseSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [diseases, setDiseases] = useState<any[]>([]);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('diseases');

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === 'diseases') {
                const response = await diseaseApi.search(searchQuery);
                setDiseases(response.data);
            } else {
                const response = await medicineApi.search(searchQuery);
                setMedicines(response.data);
            }
        } catch (error) {
            toast.error('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-search on tab change if query exists
    useEffect(() => {
        if (searchQuery) handleSearch();
    }, [activeTab]);

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] py-12 px-4 bg-muted/30">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Medical Knowledge Search</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Search for diseases, symptoms, and medications to understand conditions and treatment options.
                        Always consult a professional for medical advice.
                    </p>
                </div>

                <div className="mb-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search for ${activeTab}...`}
                                className="pl-12 h-14 rounded-2xl bg-card border-border shadow-soft text-lg"
                            />
                        </div>
                        <Button type="submit" className="h-14 px-8 rounded-2xl gradient-hero font-bold" disabled={loading}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
                        </Button>
                    </form>
                </div>

                <Tabs defaultValue="diseases" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-center mb-8">
                        <TabsList className="bg-card border border-border h-14 p-1 rounded-2xl shadow-soft">
                            <TabsTrigger value="diseases" className="rounded-xl px-8 h-12 data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground">
                                <Activity className="h-4 w-4 mr-2" />
                                Diseases
                            </TabsTrigger>
                            <TabsTrigger value="medicines" className="rounded-xl px-8 h-12 data-[state=active]:gradient-hero data-[state=active]:text-primary-foreground">
                                <Pill className="h-4 w-4 mr-2" />
                                Medicines
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="diseases" className="mt-0 outline-none">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-48 rounded-3xl bg-card animate-pulse" />)}
                            </div>
                        ) : diseases.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {diseases.map((item) => (
                                    <Card key={item.id} className="rounded-3xl border-border/50 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden bg-card group">
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-2">
                                                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                                                    {item.disease_name}
                                                </CardTitle>
                                                <Badge variant={item.severity_level === 'High' ? 'destructive' : 'secondary'} className="rounded-full px-3">
                                                    {item.severity_level} Risk
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-base line-clamp-2 italic">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    Key Symptoms
                                                </p>
                                                <p className="text-foreground">{item.symptoms}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                                                    <Pill className="h-4 w-4" />
                                                    Recommended Medicines
                                                </p>
                                                <p className="text-foreground font-medium">{item.recommended_medicines}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : searchQuery && (
                            <div className="text-center py-20">
                                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold">No diseases found</h3>
                                <p className="text-muted-foreground">Try different keywords or check for spelling errors.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="medicines" className="mt-0 outline-none">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-48 rounded-3xl bg-card animate-pulse" />)}
                            </div>
                        ) : medicines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {medicines.map((item) => (
                                    <Card key={item.id} className="rounded-3xl border-border/50 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden bg-card group">
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors flex items-center gap-3">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10">
                                                    <Pill className="h-5 w-5 text-primary" />
                                                </div>
                                                {item.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-muted-foreground italic">"{item.description}"</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Usual Dosage</p>
                                                    <p className="font-bold">{item.dosage}</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-1">Side Effects</p>
                                                    <p className="text-sm">{item.side_effects}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : searchQuery && (
                            <div className="text-center py-20">
                                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold">No medicines found</h3>
                                <p className="text-muted-foreground">Try searching by generic or brand name.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Disclaimer */}
                <div className="mt-16 p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 text-center max-w-3xl mx-auto">
                    <p className="text-amber-800 dark:text-amber-400 text-sm font-medium">
                        <span className="font-bold underline uppercase mr-2">Medical Disclaimer:</span>
                        The information provided here is for informational purposes only and is not a substitute for professional medical advice,
                        diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions
                        you may have regarding a medical condition.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DiseaseSearch;
