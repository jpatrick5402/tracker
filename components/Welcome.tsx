import SignIn from "@components/SignIn";
import containers from "@styles/containers.module.css";
import text from "@styles/text.module.css";

export default function Welcome() {
  return (
    <div className={`${containers.welcome}`}>
      <p className={`${text.title}`}>Welcome to Tracker</p>
      <p className={`${text.subtitle}`}>
        An app to track your projects and tasks
      </p>
      <SignIn />
    </div>
  );
}
