import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FREE_MONTHLY_SUGGESTIONS, REFERRAL_REWARD } from '@/lib/firebase/referralService';

const SignUp = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Extract referral code from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      
      // In a real implementation, you could fetch the referrer's name here
      // For now, we'll just set a generic name
      setReferrerName("another user");
    }
  }, [location.search]);

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto px-4 py-20">
        <Card className="animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
            {referralCode && (
              <Alert className="mt-4 bg-primary/10 border-primary/20">
                <Gift className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  You've been referred by {referrerName}! Sign up to receive {REFERRAL_REWARD} bonus AI suggestions per month.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            <AuthForm type="signup" referralCode={referralCode} />
            
            {!referralCode && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium flex items-center mb-2">
                  <Gift className="h-4 w-4 mr-2 text-primary" />
                  Benefits of using a referral code:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>Get {REFERRAL_REWARD} bonus AI suggestions per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>Both you and your referrer benefit</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>Standard monthly allowance is {FREE_MONTHLY_SUGGESTIONS} AI suggestions</span>
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary underline underline-offset-4 hover:text-primary/90">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SignUp;
