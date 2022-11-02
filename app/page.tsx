import { NextPage } from "next";
import Link from "next/link"

const Exercise = ({ children, link }: { children: React.ReactNode, link: string }) => (
  <Link href={link}><p className="bg-gray-50 rounded-lg text-4xl px-12 py-6 border-2 text-orange-400 border-orange-400 w-72 text-center hover:bg-orange-400 hover:text-white">{children}</p></Link>
);

const Home = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <header className="flex flex-col text-white bg-blue-400 items-center py-32 gap-8 flex-grow">
        <h1 className="text-6xl w-fit">Toddler Trainer</h1>
        <Link href="exercise/matching"><h2 className="px-6 py-4 border-white w-fit border-2 text-2xl rounded-md hover:rounded-3xl bg-white bg-opacity-0 hover:bg-opacity-10 transition-all duration-500">Getting Started</h2></Link>
      </header>
      <main className="flex gap-16 px-32 py-32 justify-evenly">
        <Exercise link="exercise/matching">Matching the shapes</Exercise>
        <Exercise link="exercise/traceshape">Tracing the shapes</Exercise>
        <Exercise link="exercise/traceline">Tracing the line</Exercise>
      </main>
    </div>
  );
};

export default Home;