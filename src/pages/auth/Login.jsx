import { Leaf } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role;
      const fallback = role === "vendor" ? "/vendor" : role === "super_admin" ? "/admin" : "/products";
      navigate(location.state?.from?.pathname || fallback);
    }
  };

  return (
    <div className="min-h-screen bg-[#10190f] px-5 py-10 text-white">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-3 text-xl font-black">
          <Leaf className="h-6 w-6 text-[#7ed957]" />
          Plant SaaS
        </Link>
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white/8 p-6">
          <h1 className="text-3xl font-black">Login</h1>
          <p className="mt-2 text-sm text-white/65">Access customer, vendor, or admin workspace.</p>
          {error && <p className="mt-4 rounded-md bg-red-500/15 px-3 py-2 text-sm text-red-100">{error}</p>}
          <label className="mt-6 block text-sm">
            Email
            <input
              className="mt-2 w-full rounded-md border border-white/15 bg-black/25 px-3 py-3 outline-none"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="mt-4 block text-sm">
            Password
            <input
              className="mt-2 w-full rounded-md border border-white/15 bg-black/25 px-3 py-3 outline-none"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="mt-6 w-full rounded-md bg-[#7ed957] px-4 py-3 font-black text-[#10190f]" type="submit">
            {status === "loading" ? "Signing in..." : "Sign in"}
          </button>
          <p className="mt-5 text-sm text-white/65">
            New here? <Link className="text-[#7ed957]" to="/register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
