import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function LandingPage() {
  return (
    <div className="bg-[#0d1117] min-h-screen text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="border border-blue-500 text-blue-400 text-sm px-3 py-1 rounded-full">Version 2.0 Now Live</span>
          <h1 className="text-5xl font-bold mt-6 leading-tight">
            Master Your Life <br />
            <span className="text-blue-500">One Habit at a Time.</span>
          </h1>
          <p className="text-gray-400 mt-6 text-lg max-w-lg">
            The high-performance workspace for your personal growth. Track tasks, build streaks, and gain insights with the sleekest productivity engine ever built.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">Start for Free →</a>
            <a href="#process" className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition">View Demo</a>
          </div>
          <p className="text-gray-500 mt-6 text-sm">Join <span className="text-white font-semibold">12,000+</span> productivity ninjas</p>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
            alt="App Dashboard"
            className="w-full max-w-lg rounded-2xl border border-gray-700 object-cover"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-b border-gray-800 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500k+', label: 'TASKS COMPLETED' },
            { value: '45k+', label: 'ACTIVE STREAKS' },
            { value: '1.2M hrs', label: 'TIME SAVED' },
            { value: '4.9/5', label: 'APP RATING' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-blue-500 text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center">Built for High Achievers</h2>
        <p className="text-gray-400 text-center mt-4 max-w-xl mx-auto">Every feature is designed to reduce friction and maximize your focus on what truly matters.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: '▦', title: 'Unified Dashboard', desc: 'Your entire day at a glance. Tasks, habits, and journal entries synchronized in one elegant dark interface.' },
            { icon: '★', title: 'Gamified Growth', desc: 'Earn badges and level up your productivity. Our streak system keeps you motivated and consistent.' },
            { icon: '▲', title: 'Advanced Analytics', desc: 'Visualize your progress with beautiful charts. Identify patterns in your behavior and optimize your routines.' },
            { icon: '◉', title: 'Mobile First', desc: 'A seamless transition between web and mobile. Your data is always with you, everywhere you go.' },
            { icon: '■', title: 'Secure & Private', desc: 'End-to-end encryption for your personal data. Your journals and habits are for your eyes only.' },
            { icon: '⚡', title: 'Workflow Integration', desc: 'Connect with your favorite tools. Seamlessly import tasks and calendar events for a total view.' },
          ].map((feature) => (
            <div key={feature.title} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 hover:border-blue-800 transition">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
              <p className="text-gray-400 mt-2 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-8 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center">Simple Process. Bold Results.</h2>
          <p className="text-gray-400 text-center mt-4">Getting your life in order has never been this intuitive.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center">
            {[
              { num: '01', title: 'Capture', desc: 'Quickly dump your tasks and thoughts into the inbox the moment they strike.' },
              { num: '02', title: 'Organize', desc: 'Categorize into projects, set priorities, and link habits to your daily schedule.' },
              { num: '03', title: 'Execute', desc: 'Follow your personalized focus plan and watch your productivity skyrocket.' },
            ].map((step) => (
              <div key={step.num}>
                <div className="w-14 h-14 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-lg mx-auto">{step.num}</div>
                <h3 className="text-white font-semibold text-xl mt-4">{step.title}</h3>
                <p className="text-gray-400 mt-2 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-16 text-center border border-blue-800">
          <h2 className="text-4xl font-bold">Ready to Reach Peak Performance?</h2>
          <p className="text-gray-300 mt-4">Join the thousands of users who have transformed their daily routines with Life Hub.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <a href="/register" className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition">Claim Your Account</a>
            <a href="#pricing" className="text-white font-semibold hover:text-blue-300 transition">View Pricing</a>
          </div>
          <p className="text-gray-500 text-sm mt-4">No credit card required. 14-day free trial.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;