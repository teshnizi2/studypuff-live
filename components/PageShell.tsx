import Header from "./Header";
import Footer from "./Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="gradient-surface relative grain min-h-screen">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
