import { useState, useEffect } from 'react';
import { ChartBarIcon, DocumentTextIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface LoanApplication {
  id: string;
  status: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
  };
  loanAmount: number;
  applicationDate: string;
}

export default function Dashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual loan applications from the API
    const mockData: LoanApplication[] = [
      {
        id: '1',
        status: 'Under Review',
        vehicleInfo: {
          make: 'Toyota',
          model: 'Camry',
          year: '2023',
        },
        loanAmount: 25000,
        applicationDate: '2024-04-01',
      },
      // Add more mock data as needed
    ];

    setApplications(mockData);
    setLoading(false);
  }, []);

  const stats = [
    {
      name: 'Total Applications',
      value: applications.length,
      icon: DocumentTextIcon,
    },
    {
      name: 'Under Review',
      value: applications.filter(app => app.status === 'Under Review').length,
      icon: ChartBarIcon,
    },
    {
      name: 'Total Amount',
      value: `$${applications.reduce((sum, app) => sum + app.loanAmount, 0).toLocaleString()}`,
      icon: CreditCardIcon,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
        
        {/* Stats */}
        <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </div>
          ))}
        </dl>

        {/* Applications List */}
        <div className="mt-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Applications</h2>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <div className="flex text-sm">
                          <p className="font-medium text-primary-600 truncate">
                            {application.vehicleInfo.make} {application.vehicleInfo.model} {application.vehicleInfo.year}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            <p>Application #{application.id}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-shrink-0">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <CreditCardIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                          ${application.loanAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Applied on {new Date(application.applicationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 