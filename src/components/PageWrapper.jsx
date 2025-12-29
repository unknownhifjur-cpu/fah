const PageWrapper = ({ children, className = "", fullScreen = false }) => {
  return (
    <main
      className={`
        w-full
        px-4 sm:px-6 lg:px-8
        pt-16 /* space for fixed navbar */

        ${fullScreen ? "min-h-screen flex items-center justify-center" : "min-h-auto"}
        ${className}
      `}
    >
      <div className="max-w-6xl mx-auto w-full">
        {children}
      </div>
    </main>
  );
};

export default PageWrapper;
