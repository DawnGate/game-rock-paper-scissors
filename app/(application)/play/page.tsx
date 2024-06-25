import { CombatContainer } from "./_components/combatContainer";
import { ReturnAppNav } from "./_components/ReturnAppNav";
import { CompetitorChat } from "./_components/CompetitorChat";

const Page = () => {
  return (
    <main className="min-h-screen p-2 flex items-center">
      <div className="container max-w-[1180px] mx-auto">
        <div className="game_container grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4">
          <div className="col-span-2">
            <ReturnAppNav />
            <CombatContainer />
          </div>
          <div>
            <CompetitorChat />
            {/* <DemoChat /> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
