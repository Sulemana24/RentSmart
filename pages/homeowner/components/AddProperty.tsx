"use client";
import PropertyForm from "./forms/PropertyForm";

const AddProperty = () => {
  const handleSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Add New Property
      </h2>
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProperty;
