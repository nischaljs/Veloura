 
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import RegisterBusinessForm from '../components/auth/RegisterBusinessForm';

const VendorRegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Register as a Vendor
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start selling your products on our platform
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterBusinessForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorRegistrationPage; 