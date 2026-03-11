import React from "react";

const Test = () => {
  return (
    <div className="w-full">

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <img
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative text-center px-6">
          <h1 className="text-6xl font-bold mb-6">
            Premium Clothing Manufacturer
          </h1>

          <p className="max-w-xl mx-auto mb-8">
            We manufacture high-quality garments for global fashion brands with
            modern design and superior fabrics.
          </p>

          <button className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-lg">
            Explore Collection
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 text-center gap-10">

          <div>
            <h2 className="text-4xl font-bold text-red-500">10+</h2>
            <p className="text-gray-600">Years Experience</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-red-500">500+</h2>
            <p className="text-gray-600">Happy Clients</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-red-500">100K+</h2>
            <p className="text-gray-600">Products Manufactured</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-red-500">25+</h2>
            <p className="text-gray-600">Countries Export</p>
          </div>

        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">
                Custom Manufacturing
              </h3>
              <p className="text-gray-600">
                We manufacture clothing according to your brand designs and
                requirements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">
                Fabric Sourcing
              </h3>
              <p className="text-gray-600">
                Access to premium quality fabrics and materials.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">
                Private Label
              </h3>
              <p className="text-gray-600">
                Launch your own clothing brand with our private label service.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* MANUFACTURING PROCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Our Manufacturing Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <div className="text-4xl font-bold text-red-500 mb-3">01</div>
              <p>Design & Planning</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-red-500 mb-3">02</div>
              <p>Fabric Selection</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-red-500 mb-3">03</div>
              <p>Production</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-red-500 mb-3">04</div>
              <p>Quality Check</p>
            </div>

          </div>

        </div>
      </section>

      {/* FACTORY GALLERY */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Our Factory
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <img
              src="https://images.unsplash.com/photo-1503342452485-86cfd1c7a5df"
              className="rounded-lg"
            />

            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
              className="rounded-lg"
            />

            <img
              src="https://images.unsplash.com/photo-1520975682031-a1cfe0c3a83d"
              className="rounded-lg"
            />

          </div>

        </div>
      </section>




      {/* CLIENTS */}
      <section className="py-20 bg-white text-center">

        <h2 className="text-3xl font-bold mb-10">
          Trusted by Fashion Brands
        </h2>

        <div className="flex justify-center gap-12 text-gray-500 text-xl flex-wrap">
          <span>ZARA</span>
          <span>H&M</span>
          <span>LEVIS</span>
          <span>NIKE</span>
          <span>ADIDAS</span>
        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center px-6">

          <h2 className="text-3xl font-bold mb-12">
            What Our Clients Say
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-gray-800 p-6 rounded-lg">
              <p>
                Amazing manufacturing quality and on-time delivery.
              </p>
              <h4 className="mt-4 font-semibold">Fashion Brand Owner</h4>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <p>
                They helped us launch our clothing brand successfully.
              </p>
              <h4 className="mt-4 font-semibold">Startup Founder</h4>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <p>
                Professional team with high-quality products.
              </p>
              <h4 className="mt-4 font-semibold">Retail Company</h4>
            </div>

          </div>

        </div>
      </section>

      {/* CONTACT / INQUIRY */}
      <section className="py-20 bg-red-500 text-white text-center px-6">

        <h2 className="text-4xl font-bold mb-6">
          Start Your Clothing Brand Today
        </h2>

        <p className="max-w-xl mx-auto mb-8">
          Contact us to discuss your manufacturing requirements and get a quote.
        </p>

        <button className="bg-black px-8 py-3 rounded-lg">
          Send Inquiry
        </button>

      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 py-10 text-center">
        <p>© 2026 Clothing Manufacturer. All rights reserved.</p>
      </footer>



      {/* PRODUCT SHOWCASE */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-center mb-12">
      Featured Products
    </h2>

    <div className="grid md:grid-cols-4 gap-8">

      <div className="group">
        <img
          src="https://images.unsplash.com/photo-1520975928316-7b5e0e2f1d17"
          className="rounded-lg mb-4 group-hover:scale-105 transition"
        />
        <h3 className="font-semibold">Premium Hoodie</h3>
        <p className="text-gray-500">Comfort winter wear</p>
      </div>

      <div className="group">
        <img
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
          className="rounded-lg mb-4 group-hover:scale-105 transition"
        />
        <h3 className="font-semibold">Classic T-Shirt</h3>
        <p className="text-gray-500">Soft cotton fabric</p>
      </div>

      <div className="group">
        <img
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
          className="rounded-lg mb-4 group-hover:scale-105 transition"
        />
        <h3 className="font-semibold">Denim Jacket</h3>
        <p className="text-gray-500">Premium stitching</p>
      </div>

      <div className="group">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
          className="rounded-lg mb-4 group-hover:scale-105 transition"
        />
        <h3 className="font-semibold">Formal Shirt</h3>
        <p className="text-gray-500">Elegant design</p>
      </div>

    </div>

  </div>
</section>


{/* GLOBAL EXPORT */}
<section className="py-20 bg-gray-100">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold mb-6">
      Global Export Network
    </h2>

    <p className="text-gray-600 max-w-2xl mx-auto mb-12">
      Our garments are exported to multiple countries with international
      quality standards and trusted by global fashion brands.
    </p>

    <img
      src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
      className="rounded-lg shadow-lg mx-auto"
    />

  </div>
</section>


{/* SUSTAINABILITY */}
<section className="py-20 bg-green-50">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

    <img
      src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
      className="rounded-lg shadow-lg"
    />

    <div>
      <h2 className="text-3xl font-bold mb-6">
        Sustainable Manufacturing
      </h2>

      <p className="text-gray-600 mb-6">
        We follow eco-friendly manufacturing practices including sustainable
        fabrics, responsible production, and reduced environmental impact.
      </p>

      <ul className="space-y-3 text-gray-700">
        <li>✔ Eco Friendly Fabrics</li>
        <li>✔ Ethical Manufacturing</li>
        <li>✔ Waste Reduction</li>
        <li>✔ Sustainable Packaging</li>
      </ul>
    </div>

  </div>
</section>


{/* NEWSLETTER */}
<section className="py-20 bg-black text-white text-center">

  <h2 className="text-3xl font-bold mb-4">
    Stay Updated With Fashion Trends
  </h2>

  <p className="text-gray-300 mb-8">
    Subscribe to get the latest clothing designs and manufacturing updates.
  </p>

  <div className="flex justify-center max-w-md mx-auto">

    <input
      type="email"
      placeholder="Enter your email"
      className="px-4 py-3 w-full text-black rounded-l-lg"
    />

    <button className="bg-red-500 px-6 rounded-r-lg">
      Subscribe
    </button>

  </div>

</section>

    </div>
  );
};

export default Test;