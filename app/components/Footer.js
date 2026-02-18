import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
   <footer id="contact" className="scroll-mt-20 bg-[#0B0E14] text-white pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      
        <div>
          <h2 className="text-[#8A38F5] text-xl font-bold mb-4">Gamcheon Mart</h2>
          <p className="text-gray-400 leading-relaxed">
            Your trusted source for authentic Korean food products. 
            Bringing the taste of Korea to your home.
          </p>
        </div>

        {}
        <div>
          <h2 className="text-orange-500 text-xl font-bold mb-6">Contact Us</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-400">
              <Mail className="text-orange-500 w-5 h-5" />
              <span>gamcheonmart@gmail.com</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Phone className="text-orange-500 w-5 h-5" />
              <span>09560498124</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <MapPin className="text-orange-500 w-5 h-5" />
              <span>
Espacio De Leon Roxas Ext., Digos, Philippines, 8002</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[#D91A9C] text-xl font-bold mb-6">Business Hours</h2>
          <ul className="space-y-2 text-gray-400">
            <li className="flex justify-between">
              <span>Monday - Friday:</span>
              <span>9:00 AM - 8:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday:</span>
              <span>10:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday:</span>
              <span>11:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-sm">
        © 2026 Gamcheon Mart. All rights reserved.
      </div>
    </footer>
  );
}