const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
    <div className="h-full w-full flex-col gap-8 flex items-center justify-center">
      {children}
    </div>
    <div className="h-full bg-gradient-to-l from-primary/40 to-primary/5 w-full flex flex-col justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to FleqO</h1>
      <p className="text-lg w-[80%]">
        FleqO is your go-to platform for taking mock interviews powered by AI.
        Our goal is to help you become an interview-ready developer by providing
        realistic interview experiences and personalized feedback.
      </p>
    </div>
  </div>
);

export default AuthLayout;
