import { useState } from 'react';
import { Save, Building, Bell, Shield, CreditCard, Users, Globe } from 'lucide-react';

export default function Settings() {
  const [schoolName, setSchoolName] = useState('Green Valley School');
  const [schoolEmail, setSchoolEmail] = useState('admin@greenvalley.edu');
  const [schoolPhone, setSchoolPhone] = useState('+250 788 123 456');
  const [schoolAddress, setSchoolAddress] = useState('KN 5 Rd, Kigali, Rwanda');
  const [visitFee, setVisitFee] = useState('200');
  const [autoApprove, setAutoApprove] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-primary-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your school's configuration and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building className="w-6 h-6 text-primary-900" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">School Information</h2>
            <p className="text-sm text-gray-600">Update your school's basic details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={schoolPhone}
                onChange={(e) => setSchoolPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Visit Fee Configuration</h2>
            <p className="text-sm text-gray-600">Set the fee for parent visits</p>
          </div>
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visit Fee (RWF)
          </label>
          <div className="relative">
            <input
              type="number"
              value={visitFee}
              onChange={(e) => setVisitFee(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              RWF
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This is the amount parents will pay for each visit
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Visit Approval</h2>
            <p className="text-sm text-gray-600">Configure visit approval settings</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Auto-approve visits</h3>
            <p className="text-sm text-gray-600 mt-1">
              Automatically approve visits after payment confirmation
            </p>
          </div>
          <button
            onClick={() => setAutoApprove(!autoApprove)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoApprove ? 'bg-primary-900' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoApprove ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-yellow-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">Manage notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive email alerts for new visits and approvals
              </p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications ? 'bg-primary-900' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive SMS alerts for urgent updates
              </p>
            </div>
            <button
              onClick={() => setSmsNotifications(!smsNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                smsNotifications ? 'bg-primary-900' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-primary-900" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">API Integration</h2>
            <p className="text-sm text-gray-600">Configure external integrations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Management System API Endpoint
            </label>
            <input
              type="url"
              placeholder="https://api.yourschool.com/v1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Connect to your existing school management system
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              placeholder="Enter your API key"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-orange-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600">Manage staff access and permissions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-900" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Admin Users</p>
                <p className="text-xs text-gray-600">Full system access</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">3</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Security Staff</p>
                <p className="text-xs text-gray-600">Check-in access only</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">8</span>
          </div>
        </div>

        <button className="mt-4 text-sm text-primary-900 hover:text-primary-800 font-medium">
          + Add New User
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors disabled:bg-gray-300"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
