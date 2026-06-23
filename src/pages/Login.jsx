import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isFirebaseConfigured, auth } from '../firebase/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '../firebase/AuthProvider'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

const DEMO_CREDENTIALS = {
  email: 'demo@attendflow.com',
  password: 'Demo1234',
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmail(email, password)
      toast.success('Signed in successfully')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      toast.error('Google sign-in requires Firebase configuration.')
      return
    }

    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    try {
      const targetEmail = email || window.prompt('Enter your email address to reset password')
      if (!targetEmail) return
      // sendPasswordResetEmail requires Firebase auth instance; only works when configured
      if (!isFirebaseConfigured) {
        toast.error('Password reset requires Firebase configuration')
        return
      }
      await sendPasswordResetEmail(auth, targetEmail)
      toast.success('Password reset email sent')
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left: Branding / illustration */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-white to-sky-50 items-center justify-center p-10">
            <div className="text-center">
              <div className="mx-auto mb-6 w-28 h-28 flex items-center justify-center rounded-full bg-blue-50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="4" fill="#0ea5e9" />
                  <path d="M6 12h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 16h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-sky-700">AttendFlow CRM</h2>
              <p className="mt-2 text-sm text-slate-600">Modern HR & attendance management built for Indian businesses.</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <div className="text-lg font-semibold">AttendFlow CRM</div>
                  <div className="text-sm text-slate-500">Sign in to your account</div>
                </div>
              </div>
            </div>

            {!isFirebaseConfigured && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Firebase is not configured in this app. Use demo credentials to sign in:
                <div className="mt-2 font-semibold">{DEMO_CREDENTIALS.email}</div>
                <div className="font-semibold">{DEMO_CREDENTIALS.password}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-2 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={handleForgotPassword} className="text-sky-600 hover:underline">
                  Forgot password?
                </button>
                <div className="text-slate-500">Need an account? <span className="text-sky-600">Contact admin</span></div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : null}
                  <span>Sign in</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-slate-200 py-2 rounded-md hover:bg-slate-50 disabled:opacity-60"
                >
                  <span className="w-5 h-5">
                    <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <path d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.3h147.1c-6.3 33.9-25 62.6-53.4 81.7v67h86.2c50.4-46.4 81.6-114.8 81.6-193.7z" fill="#4285F4"/>
                      <path d="M272 544.3c72.6 0 133.6-24 178.1-65.3l-86.2-67c-24 16.2-54.7 25.7-91.9 25.7-70.7 0-130.6-47.7-152-111.6H33.4v69.7C77.5 484.3 168.6 544.3 272 544.3z" fill="#34A853"/>
                      <path d="M120 327.1c-10.9-32.2-10.9-66.8 0-99l-69.7-69.7C14.2 199.2 0 235.5 0 272s14.2 72.8 50.3 113.7l69.7-69.6z" fill="#FBBC05"/>
                      <path d="M272 107.7c39.4 0 74.9 13.6 102.8 40.3l77.1-77.1C405.6 24 344.6 0 272 0 168.6 0 77.5 60 33.4 149.1l69.7 69.7C141.4 155.4 201.3 107.7 272 107.7z" fill="#EA4335"/>
                    </svg>
                  </span>
                  <span>Sign in with Google</span>
                </button>
              </div>
            </form>

            <p className="mt-6 text-xs text-slate-400 text-center">By continuing, you agree to AttendFlow's terms and privacy policy.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
