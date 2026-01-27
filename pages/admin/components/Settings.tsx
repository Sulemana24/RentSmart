import React from "react";

interface EmailSetting {
  label: string;
  defaultChecked: boolean;
}

const Settings: React.FC = () => {
  const emailSettings: EmailSetting[] = [
    {
      label: "Send booking confirmations",
      defaultChecked: true,
    },
    { label: "Send payment receipts", defaultChecked: true },
    {
      label: "Send commission notifications",
      defaultChecked: true,
    },
    { label: "Send system updates", defaultChecked: false },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Admin Settings
        </h2>

        <div className="space-y-8">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  defaultValue="RentSmart"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@rentsmart.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+233 20 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Email Settings
            </h3>
            <div className="space-y-3">
              {emailSettings.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="mt-1 w-4 h-4 text-[#00CFFF] bg-gray-100 border-gray-300 rounded focus:ring-[#00CFFF] focus:ring-2"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security
            </h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Change Admin Password
              </button>
              <button className="w-full md:w-auto px-6 py-3 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                Clear All Data
              </button>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
