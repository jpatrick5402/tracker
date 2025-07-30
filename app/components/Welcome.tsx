import SignIn from "@/app/components/SignIn";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome to Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            An elegant app to track your projects and tasks with style
          </p>
        </div>
        <div className="pt-6">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
