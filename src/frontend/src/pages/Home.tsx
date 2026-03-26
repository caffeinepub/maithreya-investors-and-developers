import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import MLMTree from "../components/MLMTree";
import Services from "../components/Services";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <MLMTree />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
