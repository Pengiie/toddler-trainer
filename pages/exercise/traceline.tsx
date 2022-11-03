import Header from "../../app/exercise/Header";
import LineTracing from "../../app/exercise/LineTracing";
import ExerciseLayout from "../../app/exercise/layout";

import "../../styles/globals.css"

const MatchingPage = () => {
  return <ExerciseLayout>
      <div className="flex flex-col items-center justify-center gap-4">
        <Header title="Tracing the line" subtitle="Trace the lines that pop up to get a higher score!" />
        <LineTracing />
      </div>
    </ExerciseLayout>
}

export default MatchingPage;