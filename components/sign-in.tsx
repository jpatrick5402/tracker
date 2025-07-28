"use client";

import { signIn } from "next-auth/react";
import buttons from "@styles/buttons.module.css";

export default function SignIn() {
  return (
    <button className={`${buttons.default}`} onClick={() => signIn("github")}>
      Sign In with GitHub
    </button>
  );
}
