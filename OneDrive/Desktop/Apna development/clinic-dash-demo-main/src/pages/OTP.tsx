import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const OTP: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const from = location.state?.from || '/';

    const handleVerify = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!email) {
            toast.error('Session expired. Please try again.');
            navigate('/login');
            return;
        }
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        const result = await verifyOtp(email, otp);
        setLoading(false);

        if (result.success) {
            toast.success('Email verified! You can now log in.');
            navigate('/login', { replace: true });
        } else {
            toast.error(result.message || 'Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md p-8 bg-card border border-border/50 shadow-card rounded-2xl">
                <button
                    onClick={() => navigate('/login')}
                    className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </button>

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 mb-4">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Verify OTP</h1>
                    <p className="text-muted-foreground mt-2">Enter the verification code sent to your email</p>
                </div>

                <div className="flex flex-col items-center gap-8">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        onComplete={() => handleVerify()}
                    >
                        <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="h-12 w-10 md:h-14 md:w-12 rounded-xl border-border bg-muted/50 text-xl" />
                            <InputOTPSlot index={1} className="h-12 w-10 md:h-14 md:w-12 rounded-xl border-border bg-muted/50 text-xl" />
                            <InputOTPSlot index={2} className="h-12 w-10 md:h-14 md:w-12 rounded-xl border-border bg-muted/50 text-xl" />
                            <InputOTPSlot index={3} className="h-12 w-10 md:h-14 md:w-12 rounded-xl border-border bg-muted/50 text-xl" />
                            <InputOTPSlot index={4} className="h-12 w-10 md:h-14 md:w-12 rounded-xl border-border bg-muted/50 text-xl" />
                            <InputOTPSlot index={5} className="h-12 w-10 md:h-14 md:w-12 rounded-xl border-border bg-muted/50 text-xl" />
                        </InputOTPGroup>
                    </InputOTP>

                    <Button
                        className="w-full h-12 rounded-xl gradient-hero shadow-soft"
                        onClick={() => handleVerify()}
                        disabled={loading || otp.length !== 6}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Didn't receive the code? <button className="text-primary font-medium hover:underline">Resend OTP</button>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default OTP;
