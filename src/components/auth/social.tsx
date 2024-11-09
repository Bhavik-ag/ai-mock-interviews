import { Button } from "../ui/button";
import { googleLogin } from "@/views/LoginView/actions";
import { Icons } from "../ui/icons";

export const Social = () => (
  <form className="w-full">
    <Button
      className="w-full p-2 text-md flex gap-2 items-center"
      variant={"outline"}
      size={"lg"}
      formAction={googleLogin}
    >
      <Icons.google className="w-auto h-full" /> Sign In with Google
    </Button>
  </form>
);
