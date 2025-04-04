import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const features = [
  'Quick and easy application process',
  'Competitive interest rates',
  'Fast approval decisions',
  'Flexible loan terms',
  'No hidden fees',
  'Expert customer support',
];

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Hero section */}
      <div className="pb-16 pt-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Drive Your Dreams with Our Auto Loans
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get the financing you need for your next vehicle. Our streamlined process makes it easy
              to apply and get approved quickly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/apply"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Apply Now
              </Link>
              <Link
                to="/check-eligibility"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Check Eligibility <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Fast & Easy</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to finance your next vehicle
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We offer competitive rates and flexible terms to help you get the vehicle you want with
              payments that fit your budget.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-semibold leading-7 text-gray-900">{feature}</p>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-16 flex justify-center">
            <Link
              to="/apply"
              className="inline-flex items-center rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Start Your Application
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 