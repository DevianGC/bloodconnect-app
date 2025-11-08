
export default function BloodTypes() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Blood Types We Need</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every blood type is valuable. Register today regardless of your type!
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"  style={{ color: 'white' }}>
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type, index) => (
            <div 
              key={type} 
              className="group relative bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">{type}</div>
                <div className="text-xs text-red-100 font-medium">Blood Type</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
