import { CombatContainer } from "./_components/combatContainer";
import { ReturnAppNav } from "./_components/ReturnAppNav";

const Page = () => {
  return (
    <main className="min-h-screen p-2 flex items-center">
      <div className="container max-w-[1180px] mx-auto">
        <div className="game_container">
          <ReturnAppNav />
          <CombatContainer />
        </div>
      </div>
    </main>
  );
};

export default Page;
