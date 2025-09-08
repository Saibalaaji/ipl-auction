import React from 'react';

const CategorySelector = ({ categories, currentCategory, onCategorySelect }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        currentCategory === category
                            ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700 transform -translate-y-0.5'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => onCategorySelect(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategorySelector;