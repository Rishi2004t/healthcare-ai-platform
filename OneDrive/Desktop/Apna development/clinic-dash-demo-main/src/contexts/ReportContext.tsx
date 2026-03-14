import React, { createContext, useContext, useState, useEffect } from 'react';
import { reportApi } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface MedicalReport {
    id: string;
    date: string;
    data: any; // Keep generic to support backend mapping
}

interface ReportContextType {
    reports: MedicalReport[];
    refreshReports: () => Promise<void>;
    addReport: (report: any) => Promise<void>;
    getReportById: (id: string) => MedicalReport | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reports, setReports] = useState<MedicalReport[]>([]);
    const { isAuthenticated } = useAuth();

    const refreshReports = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await reportApi.getMyReports();
            // Map backend Report to frontend MedicalReport structure
            const mappedReports = response.data.map((r: any) => ({
                id: `REP-${r.id}`,
                date: r.created_at,
                data: {
                    fullName: r.full_name || 'Patient', // Backend might not store all name-specifics in report model
                    symptoms: r.symptoms,
                    duration: r.duration,
                    painLevel: r.pain_level,
                    diseases: r.existing_conditions,
                    medications: r.medications,
                    lifestyle: r.lifestyle_data,
                    // Add other fields as needed
                }
            }));
            setReports(mappedReports);
        } catch (e) {
            console.error('Failed to fetch reports from backend', e);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshReports();
        } else {
            setReports([]);
        }
    }, [isAuthenticated]);

    const addReport = async (reportData: any) => {
        try {
            await reportApi.createReport(reportData);
            await refreshReports();
        } catch (error) {
            console.error('Failed to add report:', error);
            throw error;
        }
    };

    const getReportById = (id: string) => {
        return reports.find((r) => r.id === id);
    };

    return (
        <ReportContext.Provider value={{ reports, refreshReports, addReport, getReportById }}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReports = () => {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReports must be used within a ReportProvider');
    }
    return context;
};
