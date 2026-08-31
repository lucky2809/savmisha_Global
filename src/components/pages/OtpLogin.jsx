import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdArrowBack, MdMailOutline, MdErrorOutline } from "react-icons/md";
import Navbar from "../navComp/Navbar";
import NavSpacer from "../navComp/NavSpacer";
import { api } from "../../lib/api";
import useUserStore from "../../store/userStore";

const RESEND_SECONDS = 60;

/**
 * Passwordless sign-in. Same token and store update as the password form,
 * so everything downstream (ProtectedRoute, authApi) behaves identically.
 */
export default function OtpLogin() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  // Shown on the form itself. A toast alone is easy to miss, and this page
  // is where the mistake was made, so the message belongs next to the field.
  const [error, setError] = useState("");

  const otpRef = useRef(null);
  const navigate = useNavigate();
  const setAuth = useUserStore((s) => s.setAuth);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  useEffect(() => {
    if (step === "otp") otpRef.current?.focus();
  }, [step]);

  const sendCode = async (e) => {
    e?.preventDefault();

    const address = email.trim().toLowerCase();
    if (!address) {
      setError("Enter your email address");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await api.post("/login-otp/send", { email: address });
      toast.success("Code sent - check your inbox");
      setStep("otp");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      const message = err.message || "Could not send the code";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();

    const code = otp.trim();
    if (code.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await api.post("/login-otp/verify", {
        email: email.trim().toLowerCase(),
        otp: code,
      });

      // Both keys are written: the store is authoritative, the bare key is
      // what the older screens still read.
      localStorage.setItem("access_token", res.token);
      setAuth(res.user, res.token);

      toast.success("Signed in");
      navigate("/");
    } catch (err) {
      const message = err.message || "Could not verify the code";
      setError(message);
      toast.error(message);
      setOtp("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <NavSpacer />

      <main className="flex items-center justify-center px-4 pt-8 pb-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <MdMailOutline className="h-6 w-6 text-gray-700" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {step === "email" ? "Sign in with a code" : "Enter your code"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {step === "email"
                ? "We will email you a 6-digit code. No password needed."
                : `Sent to ${email}`}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3"
            >
              <MdErrorOutline className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={busy}
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none disabled:bg-gray-50 ${
                    error
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-black"
                  }`}
                />
              </label>

              <button
                type="submit"
                disabled={busy}
                className="w-full cursor-pointer rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
              >
                {busy ? "Sending..." : "Send code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verify} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-800">
                  6-digit code
                </span>
                <input
                  ref={otpRef}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  disabled={busy}
                  placeholder="000000"
                  className={`w-full rounded-xl border px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] placeholder:text-gray-300 focus:outline-none disabled:bg-gray-50 ${
                    error
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-black"
                  }`}
                />
              </label>

              <button
                type="submit"
                disabled={busy || otp.length !== 6}
                className="w-full cursor-pointer rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
              >
                {busy ? "Verifying..." : "Sign in"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                  className="flex cursor-pointer items-center gap-1 text-gray-500 hover:text-gray-900"
                >
                  <MdArrowBack className="h-4 w-4" />
                  Change email
                </button>

                <button
                  type="button"
                  onClick={sendCode}
                  disabled={busy || cooldown > 0}
                  className="cursor-pointer font-medium text-orange-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
            Prefer a password?{" "}
            <Link to="/login" className="font-semibold text-black hover:underline">
              Sign in normally
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
