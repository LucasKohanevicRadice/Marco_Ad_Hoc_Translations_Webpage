import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Disclaimer from "@/components/Disclaimer";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        {/* Visual parallax divider */}
        <div
          className="h-24 relative"
          style={{
            backgroundImage: "url('/liput_suomi_brasilia_tekstuuri.png')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "45% center",
          }}
        >
          <div className="flag-divider absolute inset-0 backdrop-brightness-75" />
        </div>
        <Disclaimer />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
