@@ .. @@
     // Test if Tailwind is working
-    if (process.env.NODE_ENV === 'development') {
-        console.log('Testing Tailwind CSS...');
-    }
-
     return (
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-4">
-            {/* Test element - remove after verification */}
-            <div className="test-tailwind mb-4 bg-red-500 text-white p-4 rounded-lg">
-                If this is red with white text, Tailwind CSS is working!
-            </div>
             <div className="max-w-7xl mx-auto">
                 <div className="flex justify-between items-center mb-6">
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">IPL Auction 2024</h1>