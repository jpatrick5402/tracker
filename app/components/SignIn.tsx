import { signIn } from "@/auth";
import buttons from "@styles/buttons.module.css";

export default function SignIn() {
  return (
    <form className="m-2">
      <button
        className={`${buttons.auth}`}
        type="button"
        onClick={async () => {
          "use server";
          await signIn("github");
        }}
      >
        Sign In with GitHub
      </button>
    </form>
  );
}
