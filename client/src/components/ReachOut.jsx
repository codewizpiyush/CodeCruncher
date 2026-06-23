import { useState } from "react";
import emailjs from "@emailjs/browser";



function ReachOut() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs.send(
      import.meta.env.VITE_EMAILJS_YOUR_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_YOUR_TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.query,
        to_email: "coc7987515756@gmail.com"
      },
      import.meta.env.VITE_EMAILJS_YOUR_PUBLIC_KEY
    )
    .then(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: formData.name, email: formData.email, query: formData.query });
    })
    .catch((error) => {
      console.error("FAILED...", error);
      setLoading(false);
    });
  };

  return (
    <div className="flex items-center justify-center px-4 rounded-2xl ">
      <div className="w-full max-w-lg  p-8 rounded-2xl shadow-xl border border-neutral-800  bg-black bg-[radial-gradient(circle_at_50%_0%,_rgba(3,141,255,0.4)_0%,_transparent_55%),radial-gradient(circle_at_0%_100%,_rgba(3,141,255,0.4)_0%,_transparent_55%),radial-gradient(circle_at_100%_100%,_rgba(3,141,255,0.4)_0%,_transparent_55%)]">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Reach Out
        </h2>

        {submitted && (
          <p className="text-green-400 text-center mb-4">
            Query sent successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
            className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="query"
            value={formData.query}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Write your message..."
            className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#038dff] hover:bg-blue-600 transition duration-300 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? "Sending..." : "Send Query"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ReachOut;