
export default function Stats() {
  return (
    <section className="py-20 relative overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/BCOimage1.jpg')] bg-cover bg-center bg-fixed"></div>
      {/* Dark Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'white' }}>Our Impact</h2>
          <p className="text-white text-lg stats-white-text">Making a difference in Olongapo City</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>500+</div>
              <div className="text-lg font-medium" style={{ color: 'white' }}>Registered Donors</div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>150+</div>
              <div className="text-lg font-medium" style={{ color: 'white' }}>Lives Saved</div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>4</div>
              <div className="text-lg font-medium" style={{ color: 'white' }}>Partner Hospitals</div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-5xl md:text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform" style={{ color: 'white' }}>24/7</div>
              <div className="text-lg font-medium" style={{ color: 'white' }}>Emergency Response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
