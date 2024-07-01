import { FindCombat } from "./_components/find-combat";
import { LeaderBoardList } from "./_components/LeaderBoardList";
import { UserHistory } from "./_components/UserHistory";
import { UserMenu } from "./_components/UserMenu";

const Page = () => {
  return (
    <main className="min-h-screen p-2 flex items-center">
      <div className="container max-w-[1180px] mx-auto">
        <div className="game_container grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
          <div>
            <LeaderBoardList />
          </div>
          <div>
            <UserMenu />
            <FindCombat />
            <UserHistory />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
