import { signOut } from "@/auth";
import buttons from "@styles/buttons.module.css";

export default function Home() {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className={`${buttons.auth}`}>Sign Out</button>
      </form>
      <p>This is where tasks & projects will show up</p>
    </div>
  );
}
