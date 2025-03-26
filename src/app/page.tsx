

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to Smite 2 Companion</h1>
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Random God Selector - Get a random god for your next match</li>
            <li>Team Generator - Create balanced random teams for custom games</li>
          </ul>
        </section>
        
      </div>
    </div>
  );
}
