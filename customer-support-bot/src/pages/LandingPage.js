import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Zap, 
  Shield, 
  Users, 
  Clock, 
  ChevronRight, 
  Bot, 
  Database,
  Server,
  Cpu,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles
} from 'lucide-react';
import FastAPILogo from '../assets/images/fastapi.png';
import ollamaLogo from '../assets/images/ollama.png';
import ReactLogo from '../assets/images/React.webp';
import SqlliteLogo from '../assets/images/sqllite.webp';
import ChromaLogo from '../assets/images/chroma.png';

function LandingPage() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Head of Customer Success",
      company: "TechCorp",
      content: "Our response time improved by 90% and customer satisfaction scores reached an all-time high.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Support Manager",
      company: "InnovateCo",
      content: "The AI handles 80% of our queries automatically while maintaining human-like interactions.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "CTO",
      company: "StartupXYZ",
      content: "Implementation was seamless and the ROI was visible within the first month.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Intelligent AI Responses",
      description: "Powered by advanced language models that understand context and provide accurate answers."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Instant responses with sub-second query processing using optimized infrastructure."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Smart Knowledge Base",
      description: "ChromaDB vector database ensures relevant information retrieval from your FAQ data."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with SQLite data persistence and robust error handling."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Round-the-clock customer support without breaks, holidays, or time zone limitations."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Track performance metrics and customer satisfaction in real-time dashboards."
    }
  ];

  const techStack = [
    { name: "React", color: "from-blue-400 to-cyan-400", description: "Modern Frontend" },
    { name: "FastAPI", color: "from-green-400 to-emerald-400", description: "High-Performance API" },
    { name: "Ollama", color: "from-purple-400 to-violet-400", description: "Local AI Models" },
    { name: "ChromaDB", color: "from-orange-400 to-red-400", description: "Vector Database" },
    { name: "SQLite", color: "from-blue-400 to-indigo-400", description: "Data Storage" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

    const handelLogin = () => {
        navigate("/login");
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI Support Pro
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
              <a href="#tech" className="hover:text-purple-300 transition-colors">Technology</a>
              <a href="#testimonials" className="hover:text-purple-300 transition-colors">Reviews</a>
              <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105" onClick={handelLogin}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-white/20">
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium">Powered by Advanced AI Technology</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Revolutionize
              </span>
              <br />
              Customer Support
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your customer service with our intelligent AI assistant that provides instant, 
              accurate answers to FAQ questions, powered by cutting-edge technology stack.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/register')}
                className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">90%</div>
                <div className="text-gray-300">Faster Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
                <div className="text-gray-300">Always Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">99.9%</div>
                <div className="text-gray-300">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 ${
                  isVisible.features ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="tech" className="relative z-10 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Built with Modern Technology
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Leveraging the latest and most reliable technologies for optimal performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-500 transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform`}>
                  {tech.name === 'React' && <img src={ReactLogo} alt="React" className="w-10 h-10" />}
                  {tech.name === 'FastAPI' && <img src={FastAPILogo} alt="FastAPI" className="w-10 h-10" />}
                  {tech.name === 'Ollama' && <img src={ollamaLogo} alt="Ollama" className="w-10 h-10" />}
                  {tech.name === 'ChromaDB' && <img src={ChromaLogo} alt="ChromaDB" className="w-10 h-10" />}
                  {tech.name === 'SQLite' && <img src={SqlliteLogo} alt="SQLite" className="w-10 h-10" />}
                  
                </div>
                <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>

          {/* Architecture Diagram */}
          <div className="mt-16 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">System Architecture</h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-2">
                  <img src={ReactLogo} alt="React" className="w-10 h-10" />
                </div>
                <span className="text-sm font-medium">React Frontend</span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-2">
                  <img src={FastAPILogo} alt="FastAPI" className="w-10 h-10" />
                </div>
                <span className="text-sm font-medium">FastAPI Server</span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-2">
                <img src={ollamaLogo} alt="Ollama" className="w-10 h-10" />                </div>
                <span className="text-sm font-medium">Ollama AI</span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <img src={ChromaLogo} alt="Chromadb" className="w-10 h-10" />
                </div>
                <span className="text-sm font-medium">ChromaDB</span>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <img src={SqlliteLogo} alt="SQLite" className="w-10 h-10" />
                </div>
                <span className="text-sm font-medium">SQLite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                What Our Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of satisfied customers who transformed their support experience
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl italic mb-6 leading-relaxed">
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            <div>
              <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
              <div className="text-purple-300">
                {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
              </div>
            </div>
            
            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-purple-900/50 to-cyan-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of companies already using our AI-powered solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
              Schedule Demo
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">AI Support Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing customer support with intelligent AI technology.
              </p>
            </div>
            
            
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AI Support Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;