import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ImageWithText from "@/components/ImageWithText";
import WhySection from "@/components/WhySection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="gradient-surface relative grain">
      <Header />
      <Hero />
      <Marquee />

      <ImageWithText
        eyebrow="Study with us · on YouTube"
        heading="Free livestreams, three times a week."
        body="Co-study sessions with gentle pacing, focus timers and a calm library soundtrack. Drop in when you need backup getting started."
        cta={{ label: "Join the livestreams", href: "/study" }}
        image="/youtube-lifestyle.jpg"
        imageAlt="Student studying at a warmly lit desk"
        accent="pink"
      />

      <ImageWithText
        eyebrow="Study with us · on Twitch"
        heading="A second monitor full of classmates."
        body="A quieter co-study chat for evenings. Judgement-free, all ages welcome — just quiet keystrokes and shared momentum."
        cta={{ label: "Watch on Twitch", href: "/study" }}
        image="/twitch-lifestyle.jpg"
        imageAlt="Student on a laptop in a cozy setup"
        reverse
        accent="sky"
      />

      <WhySection />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
}
