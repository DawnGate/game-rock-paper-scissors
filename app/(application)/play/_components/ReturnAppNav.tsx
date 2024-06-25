import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export const ReturnAppNav = () => {
  return (
    <Link href="/app">
      <Button variant="ghost">
        <ArrowLeftIcon />
        Back to Home / Exit Combat
      </Button>
    </Link>
  );
};
