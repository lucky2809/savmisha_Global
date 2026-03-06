import React from 'react'

function Footer() {
  return (
<div>
      {/* CONTACT */}
                <section
                    id="contact"
                    className="py-20 bg-gray-200 text-center px-6"
                >
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Let’s Work Together
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Looking for a reliable clothing manufacturing and export partner?
                            We are ready to bring your designs to life.
                        </p>
                        <a
                            href="mailto:info@savmishaglobaltrends.com"
                            className="inline-block bg-[#f59e7b] text-white hover:bg-white hover:text-[#f59e7b] border border-[#f59e7b] px-8 py-3 rounded-full font-semibold transition"
                        >
                            Email Us
                        </a>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-black text-white text-center py-4 text-sm">
                    ©️ 2026 SAVMISHA GLOBAL TRENDS. All Rights Reserved.
                </footer>
    </div>
      )
}

export default Footer