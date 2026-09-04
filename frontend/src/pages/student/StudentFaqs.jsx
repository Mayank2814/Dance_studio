import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const StudentFaqs = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/student/faqs");
      setFaqs(res.data);
    };
    load();
  }, []);

  return (
    <div className="card">
      <h2>FAQs</h2>
      <div className="accordion">
        {faqs.map((f) => (
          <details key={f._id} className="accordion-item">
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default StudentFaqs;


