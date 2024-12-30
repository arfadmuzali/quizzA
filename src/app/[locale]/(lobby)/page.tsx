import Hero from "@/components/Hero";
import Quizzes from "@/components/Quizzes";

export default function Home() {
  return (
    <div className="space-y-10">
      <Hero />
      <Quizzes />
    </div>
  );
}
