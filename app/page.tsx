import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/hero/Hero";
import { Sections } from "@/components/Sections";
import { ClientOverlays } from "@/components/ClientOverlays";

export default function Home() {
  return (
    <>
      <ClientOverlays />
      <Nav />
      <main className="relative w-full">
        <Hero />
        <Sections />
      </main>
    </>
  );
}
