import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Bell, Volume2, Globe, User, Heart, Activity, Save, Loader2 } from 'lucide-react';
import SettingToggle from '@/components/SettingToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { profileApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const {
    isDark,
    toggleDark,
    notifications,
    toggleNotifications,
    chatSound,
    toggleChatSound,
    language,
    toggleLanguage
  } = useTheme();

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    blood_group: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.get();
        if (response.data) {
          setProfile({
            name: response.data.name || '',
            age: response.data.age?.toString() || '',
            gender: response.data.gender || '',
            height: response.data.height?.toString() || '',
            weight: response.data.weight?.toString() || '',
            blood_group: response.data.blood_group || '',
          });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Profile doesn't exist yet, which is fine
          console.log('No profile found, user can create one.');
        } else {
          console.error('Failed to fetch profile:', error);
        }
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const data = {
        name: profile.name,
        age: parseInt(profile.age),
        gender: profile.gender,
        height: parseFloat(profile.height),
        weight: parseFloat(profile.weight),
        blood_group: profile.blood_group,
      };

      try {
        await profileApi.update(data);
      } catch (updateError: any) {
        if (updateError.response?.status === 404) {
          await profileApi.create(data);
        } else {
          throw updateError;
        }
      }
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      toast.error(error.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <SettingsIcon className="h-4 w-4" />
            <span>Preferences & Profile</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your MediCare experience and manage your health profile.
          </p>
        </div>

        {/* Health Profile Section */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Health Profile</h2>
          </div>

          <div className="bg-card border border-border/50 shadow-card rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your Name"
                  className="rounded-xl h-11"
                  disabled={fetching}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="Years"
                  className="rounded-xl h-11"
                  disabled={fetching}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(val) => setProfile({ ...profile, gender: val })}
                  disabled={fetching}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select
                  value={profile.blood_group}
                  onValueChange={(val) => setProfile({ ...profile, blood_group: val })}
                  disabled={fetching}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  placeholder="cm"
                  className="rounded-xl h-11"
                  disabled={fetching}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  placeholder="kg"
                  className="rounded-xl h-11"
                  disabled={fetching}
                />
              </div>
            </div>

            <Button
              className="w-full h-11 rounded-xl gradient-hero shadow-soft gap-2 mt-4"
              onClick={handleSaveProfile}
              disabled={loading || fetching}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Profile Changes
            </Button>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Personalization</h2>
          </div>

          <SettingToggle
            icon={Moon}
            title="Dark Mode"
            description="Switch between light and dark themes"
            checked={isDark}
            onToggle={toggleDark}
          />

          <SettingToggle
            icon={Bell}
            title="Notifications"
            description="Receive appointment reminders and updates"
            checked={notifications}
            onToggle={toggleNotifications}
          />

          <SettingToggle
            icon={Volume2}
            title="Chat Sound"
            description="Play sound when receiving messages"
            checked={chatSound}
            onToggle={toggleChatSound}
          />

          <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 shadow-card">
            <div className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl gradient-hero shadow-soft`}>
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Language</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors duration-200"
            >
              {language === 'en' ? 'English' : 'हिंदी'}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h3 className="font-semibold text-foreground mb-2">About MediCare</h3>
          <p className="text-sm text-muted-foreground mb-4">
            MediCare is a telemedicine platform designed to provide accessible healthcare
            through AI-powered assistance and doctor consultations.
          </p>
          <p className="text-xs text-muted-foreground">
            Version 1.0.0 • This is a demo application for educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
