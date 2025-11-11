const features = [
  {
    title: "File Search Aware",
    description:
      "Attach PDFs, product specs, and knowledge base articles so Gemini can cite relevant snippets in every response.",
  },
  {
    title: "Serverless by Design",
    description:
      "Next.js on Vercel for the UI, AWS Lambda + API Gateway for /api/chat. No databases or analytics required.",
  },
  {
    title: "Rich Responses",
    description:
      "Render streaming text, markdown, and optional image cards to showcase diagrams or marketing collateral.",
  },
];

const steps = [
  "Create the AWS Lambda that proxies requests to Gemini 1.5 Flash with File Search enabled.",
  "Expose the Lambda via API Gateway, enable CORS for www.yourcompany.com, and store keys in secrets.",
  "Update NEXT_PUBLIC_API_BASE_URL on Vercel, deploy, and chat with the floating widget on every page.",
];

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-24 pt-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Gemini 1.5 File Search Chatbot
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Offer instant product support with a floating AI concierge.
          </h1>
          <p className="text-lg text-slate-600">
            This starter pairs a polished Next.js widget with a lightweight AWS
            Lambda backend so you can answer questions using your own documents.
            Tap the chat bubble in the lower-right corner to see the experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              Vercel-hosted frontend
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              AWS Lambda backend
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              Gemini 1.5 File Search
            </span>
          </div>
        </div>
        <div className="flex-1 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <h2 className="mb-4 text-xl font-semibold">How it works</h2>
          <ol className="space-y-4 text-slate-600">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-600">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-slate-500">
            All sensitive keys (Gemini, File Search corpus IDs) stay on the
            server. The widget only calls your `/api/chat` endpoint.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-slate-100 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
