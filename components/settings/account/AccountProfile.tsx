import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'react-toastify';

export function AccountProfile() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Compare formData with user to detect changes
  useEffect(() => {
    if (user) {
      setIsChanged(
        formData.firstName !== user.firstName ||
          formData.lastName !== user.lastName ||
          formData.email !== user.email
      );
    }
  }, [formData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isChanged) {
      toast.info('No changes to save.');
      return;
    }

    // Filter out unchanged fields
    const updatedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key as keyof typeof formData] !== user[key as keyof typeof user]) {
        acc[key] = formData[key as keyof typeof formData];
      }
      return acc;
    }, {} as Partial<typeof formData>);

    try {
      await updateProfile(updatedFields); // Update only changed fields
      toast.success('Profile updated successfully.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Profile Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-500 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
          />
        </div>
      </div>

      {isChanged && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="mt-6 px-4 py-2 text-sm text-white bg-primary-600 rounded-xl 
            hover:bg-primary-700 transition-colors"
        >
          Save Changes
        </motion.button>
      )}
    </div>
  );
}
