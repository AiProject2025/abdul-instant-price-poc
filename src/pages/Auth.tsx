
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
});

const otpVerificationSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const signupSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  fullName: z.string().min(1, 'Full name is required'),
});

type PhoneLoginForm = z.infer<typeof phoneLoginSchema>;
type OTPVerificationForm = z.infer<typeof otpVerificationSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [currentPhone, setCurrentPhone] = useState<string>('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const phoneLoginForm = useForm<PhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: '',
    },
  });

  const otpForm = useForm<OTPVerificationForm>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      phone: '',
      fullName: '',
    },
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handlePhoneLogin = async (data: PhoneLoginForm) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      phone: data.phone,
    });

    if (error) {
      setError(error.message);
    } else {
      setCurrentPhone(data.phone);
      setShowOTPInput(true);
      setIsSignup(false);
      setMessage('We sent you a 6-digit code via SMS. Please enter it below.');
    }
    setIsLoading(false);
  };

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      phone: data.phone,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setCurrentPhone(data.phone);
      setShowOTPInput(true);
      setIsSignup(true);
      setMessage('We sent you a 6-digit code via SMS. Please enter it below.');
    }
    setIsLoading(false);
  };

  const handleOTPVerification = async (data: OTPVerificationForm) => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      phone: currentPhone,
      token: data.otp,
      type: 'sms',
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      phone: currentPhone,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('New code sent via SMS!');
    }
    setIsLoading(false);
  };

  const handleBackToPhone = () => {
    setShowOTPInput(false);
    setCurrentPhone('');
    setError(null);
    setMessage(null);
    phoneLoginForm.reset();
    signupForm.reset();
    otpForm.reset();
  };

  if (showOTPInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
                alt="Dominion Financial" 
                className="h-12 drop-shadow-lg" 
              />
            </div>
            <CardTitle className="text-2xl font-bold text-dominion-blue">
              Verify Your Phone
            </CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {currentPhone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOTPVerification)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center space-y-2">
              <Button 
                variant="outline" 
                onClick={handleResendCode}
                disabled={isLoading}
                className="w-full"
              >
                Resend Code
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBackToPhone}
                className="w-full"
              >
                Back to Phone Number
              </Button>
            </div>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="mt-4">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/87eaaf76-9665-4138-b3ce-aefec128e3db.png" 
              alt="Dominion Financial" 
              className="h-12 drop-shadow-lg" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-dominion-blue">
            Welcome to Dominion Financial
          </CardTitle>
          <CardDescription>
            Access your AI-powered lending platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...phoneLoginForm}>
                <form onSubmit={phoneLoginForm.handleSubmit(handlePhoneLogin)} className="space-y-4">
                  <FormField
                    control={phoneLoginForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending code...' : 'Send Code'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mt-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
