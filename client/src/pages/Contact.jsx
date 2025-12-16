import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Coffee } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/api/contact', formData);
      toast.success('Message sent successfully! We\'ll get back to you soon. 📧');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <MapPin className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-6 text-yellow-100">Find Our Takeaway Shop</h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto mb-4">Quick pickup location in Rajpura 📍🛒</p>
          <p className="text-lg text-yellow-300 italic font-serif">
            "Order karo, aake le jao" - Order it, come and take it away
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200">
              <h2 className="text-3xl font-serif font-bold text-amber-900 mb-8 flex items-center">
                <span className="mr-3">📞</span> Get In Touch
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-700 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-yellow-100" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-900 text-lg mb-2">📍 Address</h3>
                    <p className="text-amber-800 font-serif">
                      UpalHeri<br />
                      Rajpura, Panjab<br />
                      near Shahdil Hair Saloon, 140401
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-700 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-yellow-100" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-900 text-lg mb-2">📞 Phone</h3>
                    <p className="text-amber-800 font-serif">+91 9465520816</p>
                    <p className="text-amber-700 text-sm font-serif">Call us for reservations or questions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-700 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-yellow-100" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-900 text-lg mb-2">📧 Email</h3>
                    <p className="text-amber-800 font-serif">hello@realtastecafe.com</p>
                    <p className="text-amber-700 text-sm font-serif">We'd love to hear from you!</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-700 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-100" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-900 text-lg mb-2">🕐 Pickup Hours</h3>
                    <div className="text-amber-800 font-serif space-y-1">
                      <p>Monday - Friday: 10:00 AM - 9:00 PM</p>
                      <p>Saturday: 10:00 AM - 9:00 PM</p>
                      <p>Sunday: 10:00 AM - 8:00 PM</p>
                      <p className="text-amber-600 text-sm mt-2">📞 Call before coming to confirm order</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-700 p-3 rounded-full">
                    <span className="text-yellow-100 text-xl">📷</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-900 text-lg mb-2">📷 Instagram</h3>
                    <a href="https://www.instagram.com/real_taste_in/" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-serif hover:text-amber-600 transition-colors">@real_taste_in</a>
                    <p className="text-amber-700 text-sm font-serif">Follow us for daily updates and delicious photos!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200">
              <h2 className="text-3xl font-serif font-bold text-amber-900 mb-8 flex items-center">
                <span className="mr-3">💌</span> Send Us a Message
              </h2>
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                    👤 Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                    📝 Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-serif font-semibold text-amber-800 mb-3">
                    💭 Message
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white/70 backdrop-blur-sm font-serif resize-none"
                    placeholder="Tell us what's on your mind..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-700 text-yellow-100 py-4 px-6 rounded-full font-serif font-bold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? '⏳ Sending...' : '✉️ Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-amber-900 mb-6">Find Us Here</h2>
            <p className="text-xl text-amber-800 max-w-2xl mx-auto">Located in the heart of downtown, easy to find and even easier to love</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d321.0923276196835!2d76.55902075485523!3d30.519629444334726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1756791669651!5m2!1sen!2sin" 
                width="100%" 
                height="400" 
                style={{border: 0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Real Taste Cafe Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Coffee className="h-16 w-16 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-4xl font-serif font-bold text-yellow-100 mb-6">We Can't Wait to Meet You!</h2>
          <p className="text-xl text-amber-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Drop by for a cup of our finest brew, stay for the warm atmosphere and friendly conversations.
          </p>
          <a 
            href="/menu" 
            className="bg-yellow-500 text-amber-900 px-8 py-4 rounded-full text-lg font-serif font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl inline-block"
          >
            ☕ See What's Brewing
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;