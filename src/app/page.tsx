import HeaderNav from "@/components/sections/HeaderNav";
import Hero from "@/components/sections/Hero";
import CommunityImages from "@/components/sections/CommunityImages";
import QuickUpload from "@/components/sections/QuickUpload";
import Stats from "@/components/sections/Stats";
import LatestSections from "@/components/sections/LatestSections";
import Footer from "@/components/sections/Footer";
import BackToTop from "@/components/sections/BackToTop";

export default function Home() {
  return (
    <>
      <HeaderNav />
      <Hero />
      <QuickUpload />
      <CommunityImages />
      <Stats />
      <LatestSections />
      <Footer />
      <BackToTop />
    </>
  );
}