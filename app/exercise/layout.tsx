import Link from "next/link";

const ExerciseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center gap-8 text-center">
      {children}
      <Link href="/"><p className="border-2 py-4 px-8 text-black w-fit text-2xl border-black rounded-lg hover:bg-gray-100">Back</p></Link>
    </div>
  );
}

export default ExerciseLayout;