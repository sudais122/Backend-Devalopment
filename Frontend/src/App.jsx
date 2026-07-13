import { useState, useRef } from "react";
import {
  Eye,
  EyeOff,
  Upload,
  X,
  User,
  Mail,
  Lock,
  AtSign,
  Image as ImageIcon,
} from "lucide-react";
import "./App.css";

/* ============================================================
   Reusable field components
   ============================================================ */

function TextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = true,
}) {
  return (
    <div className="field">
      <label htmlFor={name} className="field-label">
        {label}{" "}
        {required ? (
          <span className="field-required">*</span>
        ) : (
          <span className="field-optional">(optional)</span>
        )}
      </label>
      <div className="input-wrapper">
        {Icon && <Icon size={16} className="input-icon" />}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`field-input ${Icon ? "has-icon" : ""} ${error ? "input-error" : ""}`}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder = "••••••••",
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label htmlFor={name} className="field-label">
        {label} <span className="field-required">*</span>
      </label>
      <div className="input-wrapper">
        <Lock size={16} className="input-icon" />
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`field-input has-icon has-trailing ${error ? "input-error" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="toggle-password"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function FileUpload({
  label,
  name,
  file,
  onFileChange,
  optional = false,
  error,
  variant = "avatar",
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    onFileChange(name, f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const clear = (e) => {
    e.stopPropagation();
    onFileChange(name, null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="field">
      <label className="field-label">
        {label}{" "}
        {optional ? (
          <span className="field-optional">(optional)</span>
        ) : (
          <span className="field-required">*</span>
        )}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`upload-box ${variant} ${error ? "upload-error" : ""}`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={`${label} preview`}
              className="upload-preview"
            />
            <button
              type="button"
              onClick={clear}
              className="upload-remove"
              aria-label={`Remove ${label}`}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="upload-placeholder">
            {variant === "avatar" ? (
              <User size={20} />
            ) : (
              <ImageIcon size={20} />
            )}
            <span className="upload-hint">
              <Upload size={12} /> Upload
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {file && <p className="upload-filename">{file.name}</p>}
      {error && <p className="field-error centered">{error}</p>}
    </div>
  );
}

/* ============================================================
   Registration form component
   ============================================================ */

function RegistrationForm({ onSwitch }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    avatar: null,
    coverImage: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleFileChange = (name, file) => {
    setForm((f) => ({ ...f, [name]: file }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.username.trim()) er.username = "Username is required";
    else if (!/^[a-z0-9_]{3,20}$/i.test(form.username))
      er.username = "3–20 letters, numbers, or underscores";
    if (!form.email.trim()) er.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      er.email = "Enter a valid email address";
    if (!form.fullname.trim()) er.fullname = "Full name is required";
    if (!form.password) er.password = "Password is required";
    else if (form.password.length < 8)
      er.password = "Must be at least 8 characters";
    if (!form.avatar) er.avatar = "Avatar is required";
    return er;
  };

  const handleSubmit = async () => {
    const er = validate();
    setErrors(er);

    if (Object.keys(er).length) return;

    setLoading(true);

    const data = new FormData();
    data.append("username", form.username.trim().toLowerCase());
    data.append("email", form.email.trim());
    data.append("fullname", form.fullname.trim());
    data.append("password", form.password);
    data.append("avatar", form.avatar);

    if (form.coverImage) {
      data.append("coverImage", form.coverImage);
    }

    try {
      const response = await fetch("/user/register", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await response.json();
        console.log(result)
      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      console.log("Registration successful:", result);
      alert("Registration successful!");

      // Optional: Clear the form
      setForm({
        username: "",
        email: "",
        fullname: "",
        password: "",
        avatar: null,
        coverImage: null,
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="form-title">Create your account</h2>
      <p className="form-subtitle">Join us — it only takes a minute.</p>

      <FileUpload
        label="Avatar"
        name="avatar"
        file={form.avatar}
        onFileChange={handleFileChange}
        error={errors.avatar}
        variant="avatar"
      />
      <FileUpload
        label="Cover image"
        name="coverImage"
        file={form.coverImage}
        onFileChange={handleFileChange}
        optional
        variant="cover"
      />

      <TextField
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="john_doe"
        icon={AtSign}
        error={errors.username}
      />
      <TextField
        label="Full name"
        name="fullname"
        value={form.fullname}
        onChange={handleChange}
        placeholder="John Doe"
        icon={User}
        error={errors.fullname}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="john@example.com"
        icon={Mail}
        error={errors.email}
      />
      <PasswordField
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="submit-btn"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="switch-text">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="switch-link">
          Log in
        </button>
      </p>
    </div>
  );
}

/* ============================================================
   Login form component
   ============================================================ */

function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.email.trim()) er.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      er.email = "Enter a valid email address";
    if (!form.password) er.password = "Password is required";
    return er;
  };

const handleSubmit = async () => {
  const er = validate();
  setErrors(er);

  if (Object.keys(er).length) return;

  setLoading(true);

  try {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    console.log(result);
    alert("Login successful!");

    // Optional: Clear the form
    setForm({
      email: "",
      password: "",
    });

  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div>
      <h2 className="form-title">Welcome back</h2>
      <p className="form-subtitle">Log in to continue.</p>

      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="john@example.com"
        icon={Mail}
        error={errors.email}
      />
      <PasswordField
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="submit-btn"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="switch-text">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className="switch-link">
          Register
        </button>
      </p>
    </div>
  );
}

/* ============================================================
   App — switches between the two form components
   ============================================================ */

export default function App() {
  const [mode, setMode] = useState("register"); // "register" | "login"

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Tab switcher */}
        <div className="auth-tabs">
          {["register", "login"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`auth-tab ${mode === m ? "active" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="auth-card">
          {mode === "register" ? (
            <RegistrationForm onSwitch={() => setMode("login")} />
          ) : (
            <LoginForm onSwitch={() => setMode("register")} />
          )}
        </div>
      </div>
    </div>
  );
}
