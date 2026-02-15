import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLoginUrl } from '@/const';
import { Lock, Building2 } from 'lucide-react';

export default function Login() {
  const handleLogin = () => {
    window.location.href = getLoginUrl();
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
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-br from-[#003D7A]/5 to-[#F4B024]/5 border-l-4 border-[#F4B024] rounded-lg p-4">
                  <h3 className="font-bold text-[#003D7A] mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Welcome to MCC Dashboard
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Access real-time institutional performance metrics, analytics, and reporting across all MCC campuses. Sign in with your authorized credentials to continue.
                  </p>
                </div>

                {/* Sign In Button */}
                <Button
                  onClick={handleLogin}
                  className="w-full bg-[#F4B024] hover:bg-[#E5A01F] text-[#003D7A] font-bold py-6 text-lg rounded-lg transition-all hover:shadow-lg active:scale-95"
                >
                  Sign In to Dashboard
                </Button>

                {/* Security Notice */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-600 text-center leading-relaxed">
                    🔒 This is a secure system for authorized MCC staff only. <br />
                    Unauthorized access attempts are monitored and logged.
                  </p>
                </div>
              </div>
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
