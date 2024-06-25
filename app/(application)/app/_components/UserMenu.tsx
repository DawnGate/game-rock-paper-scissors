import { ClerkLoading, SignedIn, UserButton } from "@clerk/nextjs";

import { Skeleton } from "@/components/ui/skeleton";

import { ThemeToggle } from "@/components/ThemeToggle";

import { LeaderBoardRank } from "./LeaderBoardRank";

export const UserMenu = () => {
  return (
    <div className="border-2 p-2 flex flex-wrap items-center justify-between rounded-md">
      <ClerkLoading>
        <Skeleton className="w-7 h-7" />
      </ClerkLoading>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <LeaderBoardRank />
      <ThemeToggle />
    </div>
  );
};
