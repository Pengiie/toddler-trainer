import Header from "../../app/exercise/Header";
import LineTracing from "../../app/exercise/AnimalTracing";
import ExerciseLayout from "../../app/exercise/layout";

import "../../styles/globals.css"
import ShapeTracing from "../../app/exercise/ShapeTracing";

const MatchingPage = () => {
  return <ExerciseLayout>
      <div className="flex flex-col items-center justify-center gap-4">
        <Header title="Tracing the shapes" subtitle="Trace the shapes that pop up to get a higher score!" />
        <ShapeTracing />
      </div>
    </ExerciseLayout>
}

export default MatchingPage;