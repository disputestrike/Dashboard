import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLoginUrl } from '@/const';
import { Lock } from 'lucide-react';

export default function Login() {
  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mcc-blue-900 via-mcc-blue-800 to-mcc-blue-700 flex items-center justify-center p-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mcc-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mcc-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* MCC Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-4xl font-bold text-mcc-blue-900">MCC</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Metropolitan Community College</h1>
          <p className="text-mcc-gold text-lg font-semibold">Kansas City</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-mcc-blue-900 to-mcc-blue-800 text-white rounded-t-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5" />
              <CardTitle>Institutional Performance Dashboard</CardTitle>
            </div>
            <CardDescription className="text-mcc-gold">
              Secure access for authorized staff
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <div className="space-y-6">
              <div className="bg-mcc-blue-50 border border-mcc-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-mcc-blue-900 mb-2">Welcome</h3>
                <p className="text-sm text-mcc-blue-700">
                  Sign in with your MCC credentials to access the institutional performance management system. 
                  This dashboard provides real-time metrics, analytics, and reporting for all MCC institutions.
                </p>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-mcc-gold hover:bg-mcc-gold-dark text-mcc-blue-900 font-bold py-6 text-lg rounded-lg transition-all hover:shadow-lg"
              >
                Sign In to Dashboard
              </Button>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-600 text-center">
                  This is a secure system. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm">
            © 2026 Metropolitan Community College. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
