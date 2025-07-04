import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../context/AuthContext';
import { registerBusiness } from '../../services/business';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterBusinessFormValues {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  description?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

const RegisterWithBusinessForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [businessSuccess, setBusinessSuccess] = useState('');
  const [businessError, setBusinessError] = useState('');
  const { register: registerUser, loading, error, user } = useAuth();

  // Step 1: User registration
  const userForm = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
    mode: 'onTouched',
  });

  // Step 2: Business registration
  const businessForm = useForm<RegisterBusinessFormValues>({
    defaultValues: {
      businessName: '',
      businessEmail: '',
      businessPhone: '',
      description: '',
      website: '',
      facebook: '',
      instagram: '',
      twitter: '',
    },
    mode: 'onTouched',
  });

  // Step 1 submit
  const onSubmitUser = async (values: RegisterFormValues) => {
    await registerUser(values);
    if (!error && user) setStep(2);
  };

  // Step 2 submit
  const onSubmitBusiness = async (values: RegisterBusinessFormValues) => {
    setBusinessError('');
    setBusinessSuccess('');
    try {
      await registerBusiness(values);
      setBusinessSuccess('Business registration submitted for approval!');
      setStep(3);
    } catch (err: any) {
      setBusinessError(err.message || 'Business registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-4 overflow-hidden">
      <Card className="w-full max-w-md h-[540px] flex flex-col justify-center">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-2xl font-extrabold text-center">
            {step === 1 && 'Create Your Account'}
            {step === 2 && 'Register Your Business'}
            {step === 3 && 'Registration Complete!'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 && 'Step 1: Personal Details'}
            {step === 2 && 'Step 2: Business Details'}
            {step === 3 && 'Thank you for registering!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          {step === 1 && (
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-4">
                <div className="flex gap-2">
                  <FormField
                    control={userForm.control}
                    name="firstName"
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="lastName"
                    rules={{ required: 'Last name is required' }}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={userForm.control}
                  name="email"
                  rules={{ required: 'Email is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="password"
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <Button type="submit" className="w-full mt-2 bg-indigo-600 text-white hover:bg-indigo-700" disabled={loading}>
                  {loading ? 'Registering...' : 'Next: Business Details'}
                </Button>
              </form>
            </Form>
          )}
          {step === 2 && (
            <Form {...businessForm}>
              <form onSubmit={businessForm.handleSubmit(onSubmitBusiness)} className="space-y-4">
                <FormField
                  control={businessForm.control}
                  name="businessName"
                  rules={{ required: 'Business name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Business name" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="businessEmail"
                  rules={{ required: 'Business email is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Business email" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="businessPhone"
                  rules={{ required: 'Business phone is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Business phone" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your business (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Website (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="Facebook (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="Instagram (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="Twitter (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {businessError && <div className="text-red-500 text-sm text-center">{businessError}</div>}
                <Button type="submit" className="w-full mt-2 bg-pink-600 text-white hover:bg-pink-700" disabled={loading}>
                  {loading ? 'Registering Business...' : 'Submit Registration'}
                </Button>
              </form>
            </Form>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="text-green-600 text-lg font-semibold">Registration complete!</div>
              <div className="text-center">Thank you for registering your account and business. Your business registration is pending approval.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterWithBusinessForm; 