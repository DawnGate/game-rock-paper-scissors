import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { ModalsProvider } from "@/components/providers/ModalsProvider";
import { SocketProvider } from "@/socket/SocketProvider";

const Layout = ({ children }: { children: ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <SocketProvider>{children}</SocketProvider>;
      <ModalsProvider />
    </>
  );
};

export default Layout;
