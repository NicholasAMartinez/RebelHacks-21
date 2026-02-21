import Link from "next/link";
import { VegasHeader } from "@/components/vegas/header";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-black">
      <VegasHeader />

      <header
        className="relative flex h-56 items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold text-white md:text-5xl">How It Works</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-300">
            Learn how items are assessed, gambled, and safely traded in Vegas
            Swap. Follow these steps to participate responsibly.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-md border border-yellow-400 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Back Home
            </Link>
            <Link
              href="/marketplace"
              className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <section className="mb-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border-2 border-red-900 bg-gray-800 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Upload & Describe</h2>
              <p className="text-gray-300 mb-4">
                When you upload an item provide: the asking price (your suggested
                value), brand, a short description and a product link if
                available. Clear photos and honest descriptions help with
                assessment.
              </p>
              <ul className="list-disc pl-5 text-gray-300">
                <li>Price (your suggested value)</li>
                <li>Brand</li>
                <li>Short description</li>
                <li>Product link (optional)</li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-red-900 bg-gray-800 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Assessment & Brackets</h2>
              <p className="text-gray-300 mb-4">
                After submission your item is reviewed and placed into a value
                bracket used to match similar items fairly.
              </p>
              <div className="grid gap-3">
                <div className="rounded-md bg-gray-900 p-3 text-gray-200">
                  <strong className="text-yellow-400">Low</strong>: items under $49
                </div>
                <div className="rounded-md bg-gray-900 p-3 text-gray-200">
                  <strong className="text-yellow-400">Medium</strong>: $50&ndash;$99
                </div>
                <div className="rounded-md bg-gray-900 p-3 text-gray-200">
                  <strong className="text-yellow-400">High</strong>: $100&ndash;$149
                </div>
                <div className="rounded-md bg-gray-900 p-3 text-gray-200">
                  <strong className="text-yellow-400">Premium</strong>: over $150
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10 rounded-lg border-2 border-red-900 bg-gray-800 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Gambling & Matching</h2>
            <p className="text-gray-300 mb-4">
              You may gamble an item up to 5 times. Each attempt tries to match
              your item with another in the same bracket. When a match is found
              you will be notified and given the option to pursue a trade.
            </p>
            <p className="text-gray-300">
              If you indicate you want to trade, the other party must also agree
              before any exchange is arranged.
            </p>
          </section>

          <section className="mb-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border-2 border-red-900 bg-gray-800 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Meeting & Safety</h2>
              <p className="text-gray-300 mb-4">
                All trades are expected to take place at the LVMPD Community
                Center or an agreed police station. These public locations help
                ensure safety and transparency during exchanges.
              </p>
              <p className="text-gray-300 font-semibold text-yellow-400">You are under no pressure to trade.</p>
            </div>

            <div className="rounded-lg border-2 border-red-900 bg-gray-800 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Finalizing a Trade</h2>
              <ol className="list-decimal pl-5 text-gray-300">
                <li>Both parties confirm they want to trade the matched items.</li>
                <li>Agree on time and LVMPD Community Center (or chosen station).</li>
                <li>Meet and inspect items before completing the exchange.</li>
              </ol>
            </div>
          </section>

          <section className="rounded-lg border-2 border-red-900 bg-gray-800 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Need Help?</h2>
            <p className="text-gray-300">
              Questions about assessments, brackets, or arranging a safe trade?
              Reach out to support via the app or marketplace help center.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
