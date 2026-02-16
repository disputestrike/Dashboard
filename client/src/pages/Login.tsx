import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock, Building2, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const loginMutation = trpc.auth.loginLocal.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      
      if (result.success) {
        toast.success('Login successful!');
        // Redirect to dashboard
        setLocation('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Login error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* MCC Header Bar */}
      <div className="w-full bg-gradient-to-r from-[#003D7A] to-[#0052A3] border-b-4 border-[#F4B024]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          {/* MCC Logo */}
          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md">
            <span className="text-2xl font-bold text-[#003D7A]">MCC</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Metropolitan Community College</h1>
            <p className="text-[#F4B024] font-semibold">Kansas City</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="shadow-2xl border-0 bg-white">
            {/* Card Header with MCC Blue */}
            <CardHeader className="bg-gradient-to-r from-[#003D7A] to-[#0052A3] text-white rounded-t-lg pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Institutional Performance</CardTitle>
                  <CardDescription className="text-[#F4B024] text-sm font-semibold">
                    Dashboard Access
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="pt-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-br from-[#003D7A]/5 to-[#F4B024]/5 border-l-4 border-[#F4B024] rounded-lg p-4">
                  <h3 className="font-bold text-[#003D7A] mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Welcome to MCC Dashboard
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Sign in with your credentials to access real-time institutional performance metrics and analytics.
                  </p>
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#003D7A]">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#F4B024] focus:ring-[#F4B024]"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#003D7A]">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#F4B024] focus:ring-[#F4B024]"
                  />
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#F4B024] hover:bg-[#E5A01F] text-[#003D7A] font-bold py-6 text-lg rounded-lg transition-all hover:shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>

                {/* Demo Credentials */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-blue-800">
                    <strong>Username:</strong> john.chawana
                  </p>
                  <p className="text-xs text-blue-800">
                    <strong>Password:</strong> MCC@Demo123
                  </p>
                </div>

                {/* Security Notice */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-600 text-center leading-relaxed">
                    🔒 This is a secure system for authorized MCC staff only. <br />
                    Unauthorized access attempts are monitored and logged.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              © 2026 Metropolitan Community College. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              For support, contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
