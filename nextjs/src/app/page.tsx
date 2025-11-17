import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Skills } from "@/components/home/Skills";
import { Projects } from "@/components/home/Projects";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}