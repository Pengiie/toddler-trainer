import Header from "../../app/exercise/Header";
import ExerciseLayout from "../../app/exercise/layout";

import "../../styles/globals.css"
import AnimalTracing from "../../app/exercise/AnimalTracing";

const MatchingPage = () => {
  return <ExerciseLayout>
      <div className="flex flex-col items-center justify-center gap-4">
        <Header title="Trace the animals" subtitle="Trace the animals and get a score out of 10!" />
        <AnimalTracing />
      </div>
    </ExerciseLayout>
}

export default MatchingPage;