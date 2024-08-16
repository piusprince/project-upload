import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#004C23] text-white w-full relative">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <img
              className="h-10"
              src="/fyp-logo.png"
              alt="FYP Upload Platform"
            />
            <p className=" text-base">
              Streamlining the final year project submission process for
              students and supervisors.
            </p>
            <div className="flex space-x-6">
              {/* Add your social media links here */}
              <a href="#" className="">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {/* Add more social media icons as needed */}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[#FFCB06] tracking-wider uppercase">
                  Platform
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/dashboard/projects" className="text-base ">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/projects" className="text-base ">
                      Submit Project
                    </Link>
                  </li>
                  <li>
                    <Link href="/project-guidelines" className="text-base ">
                      Project Guidelines
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-[#FFCB06] tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/faq" className="text-base ">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="text-base ">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base ">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[#FFCB06] tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base ">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-base ">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-base ">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} FYP Upload Platform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
