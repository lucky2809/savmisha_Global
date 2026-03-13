import React from "react";

const ContactParagraph = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-20">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Contact Us
        </h2>

        <p className="text-gray-600 leading-relaxed text-lg">
          At <strong>Savmisha Global Trends</strong>, we are always happy to
          connect with our customers and business partners. If you are looking
          for a reliable clothing manufacturer in Delhi or want to discuss
          bulk garment production, custom clothing, or partnership
          opportunities, our team is here to assist you. Feel free to reach
          out to us with your requirements, questions, or inquiries, and we
          will respond as soon as possible.
        </p>

        <p className="text-gray-600 leading-relaxed text-lg mt-4">
          You can contact us directly through email and our team will make
          sure to provide you with the best support and information regarding
          our manufacturing services. We look forward to building strong and
          long-term business relationships with our clients.
        </p>

        <div className="mt-8">
          <a
            href="mailto:info@savmishaglobaltrends.com"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Email Us
          </a>
        </div>

      </div>
    </section>
  );
};

export default ContactParagraph;