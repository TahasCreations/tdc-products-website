import Header from "@components/Header";
import Footer from "@components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-4">Hoş geldiniz</h2>
        <p className="text-gray-700">TDC Products ana sayfası.</p>
      </main>
      <Footer />
    </div>
  );
}
