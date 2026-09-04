import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";
import { useAuth } from "../../state/AuthContext.jsx";

const AdminFaqs = () => {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      console.log("Current user:", user);
      const res = await api.get("/admin/faqs");
      setFaqs(res.data);
    } catch (err) {
      setError("Failed to load FAQs");
      console.error("Error loading FAQs:", err);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/faqs", { ...form, isActive: true });
      setForm({ question: "", answer: "" });
      load();
    } catch (err) {
      setError("Failed to create FAQ");
      console.error("Error creating FAQ:", err);
    }
  };

  const toggleActive = async (faq) => {
    await api.put(`/admin/faqs/${faq._id}`, { isActive: !faq.isActive });
    load();
  };

  const removeFaq = async (id) => {
    await api.delete(`/admin/faqs/${id}`);
    load();
  };

  return (
    <div className="two-column">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Create FAQ</h2>
        {error && <div className="error-banner">{error}</div>}
        <div className="form-group">
          <label>Question</label>
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Answer</label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />
        </div>
        <button className="btn-primary">Add FAQ</button>
      </form>

      <div className="card">
        <h2>All FAQs</h2>
        <div className="list">
          {faqs.map((f) => (
            <div key={f._id} className="list-item">
              <div className="list-main">
                <h3>{f.question}</h3>
                <p className="muted">{f.answer}</p>
              </div>
              <div className="list-meta">
                <span
                  className={f.isActive ? "badge badge-success" : "badge badge-muted"}
                  onClick={() => toggleActive(f)}
                  style={{ cursor: "pointer" }}
                >
                  {f.isActive ? "Active" : "Hidden"}
                </span>
                <button
                  className="btn-link danger"
                  onClick={() => removeFaq(f._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFaqs;


