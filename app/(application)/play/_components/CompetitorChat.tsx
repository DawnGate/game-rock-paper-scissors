import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatContainer = () => {
  const array = [1, 2, 3, 4, 5];
  return (
    <>
      {array.map((item) => (
        <div key={item} className="mb-2">
          <span className="inline-block relative mr-2 w-5 h-5">
            <Avatar className="w-6 h-6 absolute inset-0">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </span>
          <span className="inline-block font-semibold text-rose-600">
            username:&nbsp;
          </span>
          <span className="inline text-sm">
            Something just iPad is perfect for taking the content you capture on
            iPhone and bringing it to life on an immersive canvas. You can shoot
            videos and photos on your iPhone and use the large display of your
            iPad to edit, add animations, and more. You can also pick up
            wherever you left off with Handoff.
          </span>
        </div>
      ))}
    </>
  );
};

export const CompetitorChat = () => {
  return (
    <div className="border-2 p-2 rounded-md">
      <p className="text-lg font-medium uppercase">Chat:</p>
      <div className="h-[500px] overflow-y-auto my-1">
        <ChatContainer />
      </div>
      <div className="flex gap-2">
        <Input placeholder="Chat with competitor" />
        <Button size="icon" className="shrink-0">
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};
