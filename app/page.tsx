import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/hero/Hero";
import { Sections } from "@/components/Sections";
import { ClientOverlays } from "@/components/ClientOverlays";
import { ScrollLine } from "@/components/ScrollLine";

export default function Home() {
  return (
    <>
      <ClientOverlays />
      <Nav />
      <main className="relative w-full">
        <ScrollLine />
        <Hero />
        <Sections />
      </main>
    </>
  );
}
