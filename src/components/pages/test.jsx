import React from "react";

const HomePage = () => {
  return (
    <div className="w-full">

      {/* HERO SECTION */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              From Fabric to Fashion — <br />
              <span className="text-indigo-600">We Manufacture Your Brand</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg">
              We transform ideas into premium apparel with expert craftsmanship,
              modern machinery, and reliable production for fashion brands.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
                Start Your Production
              </button>

              <button className="border border-gray-400 px-6 py-3 rounded-lg hover:bg-gray-200">
                Explore Our Work
              </button>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
              alt="Clothing Manufacturing"
              className="rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </section>


      {/* ABOUT SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            Where Quality Meets Craftsmanship
          </h2>

          <p className="mt-6 text-gray-600 text-lg">
            We specialize in turning creative ideas into high-quality garments
            that represent your brand’s identity. With skilled professionals,
            advanced manufacturing technology, and strict quality standards,
            we help fashion brands grow with reliable clothing production.
          </p>

        </div>
      </section>


      {/* SERVICES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center text-gray-900">
            Our Manufacturing Services
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold">Custom Manufacturing</h3>
              <p className="mt-3 text-gray-600">
                Garments produced according to your design, fabric,
                and specifications.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold">Private Label</h3>
              <p className="mt-3 text-gray-600">
                Launch your clothing brand with custom labels,
                tags, and packaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold">Bulk Production</h3>
              <p className="mt-3 text-gray-600">
                Large-scale clothing manufacturing with consistent
                quality and timely delivery.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* PRODUCTS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            Clothing We Manufacture
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-10 text-gray-700">

            <div className="p-4 border rounded-lg">T-Shirts</div>
            <div className="p-4 border rounded-lg">Hoodies</div>
            <div className="p-4 border rounded-lg">Shirts</div>
            <div className="p-4 border rounded-lg">Jeans</div>
            <div className="p-4 border rounded-lg">Jackets</div>
            <div className="p-4 border rounded-lg">Sportswear</div>
            <div className="p-4 border rounded-lg">Uniforms</div>
            <div className="p-4 border rounded-lg">Custom Apparel</div>

          </div>

        </div>
      </section>


      {/* PROCESS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center text-gray-900">
            Our Production Process
          </h2>

          <div className="grid md:grid-cols-5 gap-6 mt-12 text-center">

            <div>
              <h4 className="font-semibold">Consultation</h4>
              <p className="text-gray-600 text-sm mt-2">
                Understanding your brand and design vision.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Fabric Selection</h4>
              <p className="text-gray-600 text-sm mt-2">
                Choosing the right material and quality.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Sampling</h4>
              <p className="text-gray-600 text-sm mt-2">
                Creating samples for approval.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Manufacturing</h4>
              <p className="text-gray-600 text-sm mt-2">
                High-quality bulk garment production.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Delivery</h4>
              <p className="text-gray-600 text-sm mt-2">
                Final inspection and shipment.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="bg-indigo-600 py-20 text-center text-white">
        <h2 className="text-3xl font-bold">
          Start Your Clothing Production Today
        </h2>

        <p className="mt-4 text-lg">
          Partner with us to manufacture premium garments for your brand.
        </p>

        <button className="mt-8 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold">
          Request a Quote
        </button>
      </section>

    </div>
  );
};

export default HomePage;