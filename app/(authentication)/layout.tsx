import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen p-2 md:p-4 lg:px-8 flex items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
