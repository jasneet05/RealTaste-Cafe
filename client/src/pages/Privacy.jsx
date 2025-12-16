import { Shield, Lock, Eye, Clock } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
          <h1 className="text-5xl font-serif font-bold mb-6 text-yellow-100">Privacy Policy</h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200">
            <div className="flex items-center space-x-3 mb-8">
              <Clock className="h-6 w-6 text-amber-600" />
              <p className="text-amber-700 font-serif">Last updated: January 2025</p>
            </div>

            <div className="space-y-8 text-amber-900 font-serif">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">1. Information We Collect</h2>
                <p className="leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create an account or place an order</li>
                  <li>Contact us through our website or email</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Leave reviews or feedback</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">2. How We Use Your Information</h2>
                <p className="leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Respond to your comments and questions</li>
                  <li>Improve our services and user experience</li>
                  <li>Send promotional emails (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">3. Information Sharing</h2>
                <p className="leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted service providers who assist us in operating our website and conducting our business.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">4. Data Security</h2>
                <div className="flex items-start space-x-3 mb-4">
                  <Lock className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <p className="leading-relaxed">
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">5. Cookies and Tracking</h2>
                <p className="leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Keep you logged in to your account</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Improve our website functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">6. Your Rights</h2>
                <div className="flex items-start space-x-3 mb-4">
                  <Eye className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <p className="leading-relaxed mb-4">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Access and update your personal information</li>
                      <li>Delete your account and personal data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Request a copy of your data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">7. Third-Party Links</h2>
                <p className="leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">8. Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">9. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">10. Contact Us</h2>
                <p className="leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p><strong>Email:</strong> hello@realtastecafe.com</p>
                  <p><strong>Phone:</strong> +91 9465520816</p>
                  <p><strong>Address:</strong> UpalHeri, Rajpura, Punjab, India 140401</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;