import React, { useState } from "react";

// Simulated API calls (replace with real backend logic)
const checkEmailAvailability = async (email) => {
  await new Promise(res => setTimeout(res, 600));
  if (email === "test@pikkle.com") return false;
  return true;
};

const submitRegistration = async (formData) => {
  await new Promise(res => setTimeout(res, 1000));
  return { success: true };
};

const strongPassword = (pwd) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);

const DriverRegisterFormEnhanced = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    licenseFile: null,
  });
  const [errors, setErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Email validation and availability check
  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setForm({ ...form, email });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("Format invalide");
      return;
    }
    setEmailStatus("Vérification en cours…");
    const available = await checkEmailAvailability(email);
    setEmailStatus(available ? "✓ Email disponible" : "✗ Email déjà utilisé");
  };

  // Form field change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation
    if (!form.name.trim()) newErrors.name = "Nom requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email invalide";
    if (!strongPassword(form.password))
      newErrors.password =
        "Mot de passe faible (8+ caractères, majuscule, minuscule, chiffre, symbole)";
    if (form.password !== form.confirm) newErrors.confirm = "Les mots de passe ne correspondent pas";
    if (!form.licenseFile) newErrors.licenseFile = "Fichier permis requis";
    else if (form.licenseFile.size > 3 * 1024 * 1024)
      newErrors.licenseFile = "Fichier trop volumineux (max 3 Mo)";
    else if (!["application/pdf", "image/jpeg", "image/png"].includes(form.licenseFile.type))
      newErrors.licenseFile = "Format accepté: PDF, JPG, PNG";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      const resp = await submitRegistration(form);
      setSubmitting(false);
      if (resp.success) setRegistered(true);
    }
  };

  if (registered)
    return (
      <div className="registration-status">
        <h2>Inscription réussie !</h2>
        <p>
          Merci pour votre inscription. Un email de vérification a été envoyé.
          <br />
          Vous pouvez suivre l’état de votre inscription sur la page « Suivi ».
        </p>
      </div>
    );

  return (
    <form className="driver-register-form" onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Inscription conducteur / Pikklers</h2>

      <div>
        <label htmlFor="name">Nom complet</label>
        <input
          name="name"
          type="text"
          placeholder="Ex: Jean Dupont"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className="err">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          placeholder="exemple@domaine.com"
          value={form.email}
          onChange={handleEmailChange}
        />
        {emailStatus && <span className={emailStatus.startsWith("✓") ? "ok" : "err"}>{emailStatus}</span>}
        {errors.email && <span className="err">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input
          name="password"
          type="password"
          placeholder="Mot de passe fort"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <span className="err">{errors.password}</span>}
      </div>
      <div>
        <label htmlFor="confirm">Confirmer le mot de passe</label>
        <input
          name="confirm"
          type="password"
          placeholder="Confirmez le mot de passe"
          value={form.confirm}
          onChange={handleChange}
        />
        {errors.confirm && <span className="err">{errors.confirm}</span>}
      </div>

      <div>
        <label htmlFor="licenseFile">Permis de conduire (PDF/JPG/PNG, max 3Mo)</label>
        <input
          name="licenseFile"
          type="file"
          accept=".pdf,image/jpeg,image/png"
          onChange={handleChange}
        />
        {errors.licenseFile && <span className="err">{errors.licenseFile}</span>}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Inscription en cours..." : "S’inscrire"}
      </button>
    </form>
  );
};

export default DriverRegisterFormEnhanced;