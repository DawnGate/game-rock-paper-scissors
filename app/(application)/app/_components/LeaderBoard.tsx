import { getRankTitle } from "@/lib/utils";
import Image from "next/image";

export const LeaderBoard = () => {
  const users = [
    {
      username: "hello this is a long long name hello this is a long long name",
      point: 12342,
      win_streak: 1,
    },
    {
      username: "hello this is a long long name",
      point: 506,
      win_streak: 10,
    },
    {
      username: "Lionel Reilly",
      point: 0,
      win_streak: 10,
    },
    {
      username: "Stacey Ward",
      point: 50600,
      win_streak: 3,
    },
    {
      username: "Alice Morse",
      point: 3001,
      win_streak: 10,
    },
    {
      username: "Dante Hays",
      point: 1000000,
      win_streak: 1000,
    },
  ];
  return (
    <div className="rounded-md border-2 h-full p-2">
      <h1 className="uppercase text-lg font-bold text-center">Leader board</h1>
      <ul className="space-y-2">
        {users.map((user, index) => {
          const rankTitle = getRankTitle(user.point);

          return (
            <li key={user.username}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-3/4 pr-2">
                  <p className="text-lg font-bold">{index + 1}</p>
                  <Image
                    className="w-10 h-10"
                    alt="Avatar"
                    src="/image/default-avatar.png"
                    width={40}
                    height={40}
                  />
                  <p className="truncate">{user.username}</p>
                </div>
                <div className="shrink-0 w-1/4">
                  <p className="text-sm truncate">
                    Rank:{" "}
                    <span
                      className="font-bold"
                      style={{
                        color: rankTitle.color,
                      }}
                    >
                      {rankTitle.title}
                    </span>
                  </p>
                  <p className="text-sm truncate">
                    Point:{" "}
                    <span className="font-semibold text-slate-500">
                      {user.point}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
