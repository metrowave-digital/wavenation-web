export default function NewsletterSignup() {
  return (
    <form
      action="/api/newsletter"
      method="POST"
      className="mt-16 w-full max-w-lg bg-darkcard p-8 rounded-2xl shadow-neon border border-electric/40"
    >
      <h3 className="text-2xl font-bold text-electric text-center">
        Join the WaveNation List
      </h3>
      <p className="text-center opacity-70 mt-2">
        Get updates, shows, events, exclusives & more.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          className="w-full px-4 py-3 rounded bg-black text-white border border-electric/30 focus:outline-electric"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          className="w-full px-4 py-3 rounded bg-black text-white border border-electric/30 focus:outline-electric"
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className="w-full px-4 py-3 mt-4 rounded bg-black text-white border border-electric/30 focus:outline-electric"
      />

      <button
        type="submit"
        className="mt-6 w-full py-3 bg-electric text-black font-semibold rounded-lg hover:shadow-neon transition-all"
      >
        Sign Up
      </button>
    </form>
  );
}
