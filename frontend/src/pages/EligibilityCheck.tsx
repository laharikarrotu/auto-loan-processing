import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShieldCheckIcon, DocumentCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import EligibilityChecker from '../components/EligibilityChecker';

export default function EligibilityCheck() {
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  const benefits = [
    {
      name: 'Quick Check',
      description: 'Get instant feedback on your loan eligibility without affecting your credit score.',
      icon: ClockIcon,
    },
    {
      name: 'Secure Process',
      description: 'Your information is encrypted and protected with industry-standard security measures.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Pre-qualification',
      description: 'Find out your potential loan terms and rates before submitting a full application.',
      icon: DocumentCheckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero section */}
      <div className="px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:gap-12 lg:flex-row lg:items-center lg:justify-between">
            {/* Left column - Text content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Check Your Eligibility
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg md:mt-6 lg:max-w-xl">
                Find out if you qualify for an auto loan in minutes. Our quick eligibility check won't
                affect your credit score and helps you understand your options before applying.
              </p>
            </div>

            {/* Right column - Form */}
            <div className="flex-1 w-full">
              <div className="mx-auto max-w-lg rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-8 lg:mx-0 lg:max-w-none lg:p-10">
                <EligibilityChecker />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Benefits</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              Why Check Your Eligibility First?
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg md:mt-6">
              Our eligibility checker helps you make informed decisions about your auto loan application
              before you commit.
            </p>
          </div>

          <dl className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-10">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <benefit.icon className="absolute left-0 top-1 h-5 w-5 text-primary-600" aria-hidden="true" />
                  {benefit.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{benefit.description}</dd>
              </div>
            ))}
          </dl>

          {/* CTA section */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:mt-16">
            <Link
              to="/apply"
              className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:w-auto"
            >
              Apply Now
              <ArrowRightIcon className="ml-2 -mr-0.5 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 