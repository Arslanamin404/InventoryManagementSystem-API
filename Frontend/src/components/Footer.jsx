export const Footer = () => {
  return (
    <footer className="w-full border-t py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
          © {new Date().getFullYear()} IMS. All rights reserved.
        </p>
        <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
          For internal use only. Contact IT support for assistance.
        </p>
      </div>
    </footer>
  );
};
