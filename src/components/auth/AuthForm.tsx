import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  UserPlus, 
  CheckCircle2, 
  Settings, 
  Database, 
  Layers, 
  Lock, 
  Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Form schemas
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

interface AuthFormProps {
  type: 'signin' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showCreationOverlay, setShowCreationOverlay] = useState(false);
  const [creationStep, setCreationStep] = useState(0);
  const [creationComplete, setCreationComplete] = useState(false);

  // Account creation steps with messages and icons
  const creationSteps = [
    { message: "Creating your account...", icon: UserPlus },
    { message: "Setting up your clinic profile...", icon: Settings },
    { message: "Initializing database connection...", icon: Database },
    { message: "Setting up patient management...", icon: Layers },
    { message: "Configuring security settings...", icon: Lock },
    { message: "Account successfully created!", icon: CheckCircle2 }
  ];

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSignInSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setShowCreationOverlay(true);
    
    // Simulate the account creation process with steps
    const animateCreation = async () => {
      for (let i = 0; i < creationSteps.length; i++) {
        setCreationStep(i);
        // Wait between steps - total of about 8 seconds
        await new Promise(resolve => setTimeout(resolve, 1300));
      }
      
      setCreationComplete(true);
      
      // Actually create the account after showing all steps
      try {
        await signUp(data.email, data.password, data.name);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Small additional delay for better UX
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setShowCreationOverlay(false);
      }
    };
    
    animateCreation();
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      
      if (type === 'signup') {
        setShowCreationOverlay(true);
        
        // Simulate the account creation process with steps
        for (let i = 0; i < creationSteps.length; i++) {
          setCreationStep(i);
          // Wait between steps - total of about 8 seconds
          await new Promise(resolve => setTimeout(resolve, 1300));
        }
        
        setCreationComplete(true);
        
        // Small delay before redirecting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGoogleLoading(false);
      setShowCreationOverlay(false);
    }
  };

  const GoogleSignInButton = () => (
    <div className="py-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {type === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {type === 'signin' 
          ? 'Quick and secure access to your account' 
          : 'Create your account with Google credentials'}
      </p>
      <Button 
        size="lg"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <div className="flex items-center">
            <div className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></div>
            <span>Signing in with Google...</span>
          </div>
        ) : (
          <>Continue with Google</>
        )}
      </Button>
    </div>
  );

  const EmailToggleButton = () => (
    <Button
      variant="outline"
      type="button"
      className="w-full mt-4 flex items-center justify-center gap-2"
      onClick={() => setShowEmailForm(!showEmailForm)}
    >
      <Mail className="h-4 w-4" />
      {showEmailForm ? 'Hide email form' : `Continue with email instead`}
      {showEmailForm ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  );

  const renderEmailForm = () => {
    if (type === 'signin') {
      return (
        <div className="mt-4">
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-t-2 border-r-2 border-foreground rounded-full animate-spin mr-2"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In with Email'
                )}
              </Button>
            </form>
          </Form>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-6">
            <FormField
              control={signUpForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-t-2 border-r-2 border-foreground rounded-full animate-spin mr-2"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account with Email'
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  };

  return (
    <>
      {showCreationOverlay && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center">
                {creationComplete ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {React.createElement(creationSteps[creationStep].icon, { 
                        className: `h-10 w-10 ${creationStep === creationSteps.length - 1 ? 'text-green-500' : 'text-primary'}`
                      })}
                    </div>
                    <svg className="animate-spin h-16 w-16 text-primary/20" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d={`M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z`}
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold">
                {creationSteps[creationStep].message}
              </h3>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(creationStep + 1) / creationSteps.length * 100}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Setting up your clinic management system...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in space-y-4">
        <GoogleSignInButton />
        
        <div className="relative mt-6 mb-2">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
        
        <EmailToggleButton />
        
        <AnimatePresence>
          {showEmailForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {renderEmailForm()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AuthForm;
