'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('General Inquiry');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
        {/* Nebula glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nebula-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-nebula-800/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alien-green mb-4">
            GET IN TOUCH
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider text-white mb-4">
            CONTACT US
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Have a question, feedback, or need support? We&apos;re here to help.
            Reach out and our team will get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Email */}
          <div className="card-glass p-6 text-center group hover:border-nebula-600/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 text-nebula-400" />
            </div>
            <h3 className="font-display text-lg text-white mb-1">Email Us</h3>
            <a
              href="mailto:support@ufolabz.com"
              className="text-sm text-muted group-hover:text-alien-green transition-colors"
            >
              support@ufolabz.com
            </a>
          </div>

          {/* Phone */}
          <div className="card-glass p-6 text-center group hover:border-nebula-600/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-5 h-5 text-nebula-400" />
            </div>
            <h3 className="font-display text-lg text-white mb-1">Call Us</h3>
            <a
              href="tel:+41000000000"
              className="text-sm text-muted group-hover:text-alien-green transition-colors"
            >
              +41 00 000 00 00
            </a>
          </div>

          {/* Location */}
          <div className="card-glass p-6 text-center group hover:border-nebula-600/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-5 h-5 text-nebula-400" />
            </div>
            <h3 className="font-display text-lg text-white mb-1">Visit Us</h3>
            <p className="text-sm text-muted group-hover:text-alien-green transition-colors">
              Zurich, Switzerland
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-glass p-8 md:p-10">
          {submitted ? (
            <div className="text-center p-8">
              <CheckCircle2 className="w-16 h-16 text-alien-green mx-auto mb-4" />
              <h2 className="font-display text-3xl text-white mb-2">MESSAGE SENT!</h2>
              <p className="text-muted">
                We will get back to you within 24 hours.
              </p>
              <button
                onClick={resetForm}
                className="btn-outline mt-6"
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-alien-green/50 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-alien-green/50 transition-colors"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-alien-green/50 transition-colors"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Affiliate Program">Affiliate Program</option>
                  <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-alien-green/50 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Business Hours */}
      <section className="max-w-2xl mx-auto px-4 mt-8 mb-16">
        <div className="card-glass p-6 text-center">
          <Clock className="w-8 h-8 text-nebula-400 mx-auto mb-3" />
          <h3 className="font-display text-lg text-white mb-3">BUSINESS HOURS</h3>
          <p className="text-sm text-muted">Monday — Friday: 9:00 — 18:00 CET</p>
          <p className="text-sm text-muted">Saturday &amp; Sunday: Closed</p>
        </div>
      </section>
    </div>
  );
}
