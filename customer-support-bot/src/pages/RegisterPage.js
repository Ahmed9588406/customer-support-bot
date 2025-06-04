import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, UserPlus, Sparkles, Shield, Check } from 'lucide-react';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    return { minLength, hasUpperCase, hasLowerCase, hasNumbers, hasNonalphas };
  };

  const passwordStrength = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.username || !formData.password) {
        throw new Error('Username and password are required');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!isPasswordValid) {
        throw new Error('Password does not meet security requirements');
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        // In a real app, you'd use navigate('/login')
        console.log('Registration successful! Redirecting to login...');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Registration Successful!</h1>
          <p className="text-emerald-200/80 mb-4">Please log in to continue.</p>
          <div className="w-8 h-8 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main register container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Join Us Today
            </h1>
            <p className="text-purple-200/80 text-sm">
              Create your account to get started
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Register form */}
          <div className="space-y-6">
            {/* Username field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Password field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                required
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300 hover:text-purple-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-300">Password Strength</span>
                  <span className="text-xs text-purple-300">
                    {Object.values(passwordStrength).filter(Boolean).length}/5
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {Object.values(passwordStrength).map((valid, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-colors ${
                        valid ? 'bg-emerald-500' : 'bg-white/20'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="text-xs space-y-1">
                  <div className={`flex items-center space-x-2 ${passwordStrength.minLength ? 'text-emerald-400' : 'text-purple-300/60'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.minLength ? 'bg-emerald-500' : 'bg-white/20'}`}></div>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordStrength.hasUpperCase ? 'text-emerald-400' : 'text-purple-300/60'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasUpperCase ? 'bg-emerald-500' : 'bg-white/20'}`}></div>
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordStrength.hasLowerCase ? 'text-emerald-400' : 'text-purple-300/60'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasLowerCase ? 'bg-emerald-500' : 'bg-white/20'}`}></div>
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordStrength.hasNumbers ? 'text-emerald-400' : 'text-purple-300/60'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasNumbers ? 'bg-emerald-500' : 'bg-white/20'}`}></div>
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordStrength.hasNonalphas ? 'text-emerald-400' : 'text-purple-300/60'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasNonalphas ? 'bg-emerald-500' : 'bg-white/20'}`}></div>
                    <span>One special character</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300 hover:text-purple-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password match indicator */}
            {formData.confirmPassword && (
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  formData.password === formData.confirmPassword ? 'bg-emerald-500' : 'bg-red-500'
                }`}></div>
                <span className={
                  formData.password === formData.confirmPassword ? 'text-emerald-400' : 'text-red-400'
                }>
                  {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </span>
              </div>
            )}

            {/* Register button */}
            <button
              onClick={handleRegister}
              disabled={isLoading || !isPasswordValid || formData.password !== formData.confirmPassword}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-purple-300/80">
              Already have an account?{' '}
              <a
                href="#"
                className="text-violet-300 hover:text-violet-200 transition-colors hover:underline font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 text-center">
          <p className="text-purple-300/60 text-sm">
            Secure • Protected • Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;