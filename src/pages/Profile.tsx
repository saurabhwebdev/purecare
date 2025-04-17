import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.displayName) return 'U';
    const names = user.displayName.split(' ');
    if (names.length === 1) return names[0][0];
    return `${names[0][0]}${names[names.length - 1][0]}`;
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile; 