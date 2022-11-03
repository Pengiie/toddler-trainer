import Header from "../../app/exercise/Header";
import Matching from "../../app/exercise/Matching";
import ExerciseLayout from "../../app/exercise/layout";

import "../../styles/globals.css"

const MatchingPage = () => {
  return <ExerciseLayout>
      <div className="flex flex-col items-center justify-center gap-4">
        <Header title="Matching Shapes" subtitle="Click and drag the purple shape to the matching shape!" />
        <Matching />
      </div>
    </ExerciseLayout>
}

export default MatchingPage;