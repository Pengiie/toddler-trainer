import Header from "../Header";
import Matching from "./Matching";


const MatchingPage = () => {
  return <div className="flex flex-col items-center justify-center gap-4">
    <Header title="Matching Shapes" subtitle="Click and drag the purple shape to the matching shape!" />
    <Matching />;
    </div>
}

export default MatchingPage;