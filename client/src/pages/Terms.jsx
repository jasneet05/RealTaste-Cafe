import { Shield, FileText, Clock } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
          <h1 className="text-5xl font-serif font-bold mb-6 text-yellow-100">Terms of Service</h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto">
            Our commitment to fair and transparent service
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
                <h2 className="text-2xl font-bold mb-4 text-amber-800">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using Real Taste Café's website and services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">2. Use License</h2>
                <p className="leading-relaxed mb-4">
                  Permission is granted to temporarily use Real Taste Café's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">3. Orders and Payment</h2>
                <p className="leading-relaxed mb-4">
                  When you place an order with Real Taste Café:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All orders are subject to availability and confirmation</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment must be made at the time of order</li>
                  <li>We reserve the right to refuse or cancel orders</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">4. Delivery Policy</h2>
                <p className="leading-relaxed">
                  We strive to deliver your orders within the estimated time frame. However, delivery times may vary due to weather conditions, traffic, or other unforeseen circumstances. We are not liable for delays beyond our control.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">5. Cancellation and Refunds</h2>
                <p className="leading-relaxed">
                  Orders can be cancelled within 5 minutes of placement. Once preparation begins, cancellations may not be possible. Refunds will be processed within 3-5 business days for eligible cancellations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">6. User Accounts</h2>
                <p className="leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">7. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  Real Taste Café shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">8. Contact Information</h2>
                <p className="leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-amber-50 rounded-lg">
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

export default Terms;