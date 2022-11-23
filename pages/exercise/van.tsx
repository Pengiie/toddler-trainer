import Header from "../../app/exercise/Header";
import Van from "../../app/exercise/Van";
import ExerciseLayout from "../../app/exercise/layout";

import "../../styles/globals.css"

const MatchingPage = () => {
  return <ExerciseLayout>
      <div className="flex flex-col items-center justify-center gap-4">
        <Header title="Put the kid in the van" subtitle="Read above!" />
        <Van />
      </div>
    </ExerciseLayout>
}

export default MatchingPage;