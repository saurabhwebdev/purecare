import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Gift, Copy, Share, Users, Award, UserPlus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FREE_MONTHLY_SUGGESTIONS, REFERRAL_REWARD, getUserReferralInfo, getUserUsage } from '@/lib/firebase/referralService';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [referralInfo, setReferralInfo] = useState({
    referralCode: '',
    referralLink: '',
    referralCount: 0,
    referredUsers: [] as string[]
  });
  const [referralBonus, setReferralBonus] = useState(0);
  const [wasReferred, setWasReferred] = useState(false);
  const [isLoadingReferral, setIsLoadingReferral] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.displayName) return 'U';
    const names = user.displayName.split(' ');
    if (names.length === 1) return names[0][0];
    return `${names[0][0]}${names[names.length - 1][0]}`;
  };

  // Load referral info when component mounts
  useEffect(() => {
    if (user?.uid) {
      loadReferralInfo();
    }
  }, [user]);

  const loadReferralInfo = async () => {
    if (!user?.uid) return;
    
    setIsLoadingReferral(true);
    try {
      // Get referral info for sharing
      const data = await getUserReferralInfo(user.uid);
      setReferralInfo({
        referralCode: data.referralCode,
        referralLink: data.referralLink,
        referralCount: data.referralCount,
        referredUsers: data.referredUsers
      });
      
      // Get usage data to check if user was referred
      const usage = await getUserUsage(user.uid);
      setWasReferred(!!usage.referredBy);
      setReferralBonus(usage.referralBonus || (usage.referredBy ? REFERRAL_REWARD : 0));
    } catch (error) {
      console.error("Error fetching referral info:", error);
      toast({
        title: "Error",
        description: "Failed to load referral information. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReferral(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      await updateFirebaseProfile(user, {
        displayName: displayName,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralInfo.referralLink)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually.",
          variant: "destructive",
        });
      });
  };

  return (
    <DashboardLayout>
      <div className="container max-w-5xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and profile information</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Profile Information Card */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="text-xl">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your profile photo will be shown across the platform
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Upload New Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" disabled>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    placeholder="Your email"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your email address is used for signing in and cannot be changed here.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View account details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Account ID</p>
                <p className="text-sm text-muted-foreground break-all">{user?.uid}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email Verified</p>
                <p className="text-sm">
                  {user?.emailVerified ? (
                    <span className="text-green-500">Verified</span>
                  ) : (
                    <span className="text-amber-500">Not Verified</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Sign In</p>
                <p className="text-sm text-muted-foreground">
                  {user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>

              <Separator className="my-2" />

              <div className="space-y-1">
                <p className="text-sm font-medium">Authentication Methods</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                    {user?.providerData[0]?.providerId === 'password'
                      ? 'Email/Password'
                      : user?.providerData[0]?.providerId === 'google.com'
                      ? 'Google'
                      : user?.providerData[0]?.providerId || 'Unknown'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Program Card */}
          <Card className="col-span-full md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">Referral Program</CardTitle>
                <CardDescription>Invite colleagues and earn bonus AI suggestions</CardDescription>
              </div>
              <Gift className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Referral Stats */}
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      Your AI Suggestion Rewards
                    </h3>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {isLoadingReferral ? '...' : `${referralInfo.referralCount} referrals`}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Base Monthly Allowance</span>
                      <span className="font-medium">{FREE_MONTHLY_SUGGESTIONS} suggestions</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Your Referral Bonus</span>
                      <span className="font-medium text-primary">+{isLoadingReferral ? '...' : (referralInfo.referralCount * REFERRAL_REWARD)} suggestions</span>
                    </div>
                    {wasReferred && (
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <UserPlus className="h-3 w-3 mr-1 text-green-600" />
                          Referred User Bonus
                        </span>
                        <span className="font-medium text-green-600">+{isLoadingReferral ? '...' : referralBonus} suggestions</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total Monthly Allowance</span>
                      <span>{isLoadingReferral ? '...' : (FREE_MONTHLY_SUGGESTIONS + (referralInfo.referralCount * REFERRAL_REWARD) + referralBonus)} suggestions</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      Successful Referrals: {isLoadingReferral ? '...' : referralInfo.referredUsers.length}
                    </h4>
                    {wasReferred && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded text-sm text-green-700 flex items-center">
                        <UserPlus className="h-4 w-4 mr-2 text-green-600" />
                        You were referred by another user and received a bonus!
                      </div>
                    )}
                  </div>
                </div>

                {/* Referral Link */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Share Your Referral Link</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Each successful referral gives you {REFERRAL_REWARD} extra AI suggestions per month. 
                        Your colleagues will also get {REFERRAL_REWARD} bonus suggestions when they sign up with your link.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="referral-code">Your Referral Code</Label>
                      <Input 
                        id="referral-code" 
                        value={isLoadingReferral ? 'Loading...' : referralInfo.referralCode}
                        readOnly 
                        className="font-mono bg-muted"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="referral-link">Your Referral Link</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="referral-link" 
                          value={isLoadingReferral ? 'Loading...' : referralInfo.referralLink}
                          readOnly 
                          className="bg-muted"
                        />
                        <Button onClick={handleCopyReferralLink} disabled={isLoadingReferral}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Join PureCare with my referral',
                            text: 'Sign up to PureCare using my referral link and get bonus AI suggestions!',
                            url: referralInfo.referralLink
                          }).catch(err => console.error('Error sharing:', err));
                        } else {
                          handleCopyReferralLink();
                        }
                      }}
                      disabled={isLoadingReferral}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share Referral Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile; 