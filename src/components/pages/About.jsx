import Footer from "../navComp/Footer";
import Navbar from "../navComp/Navbar";
import Contact from "./Contact";


const About = () => {
    return (
        <div>
            <Navbar />
            <div className="mt-20 lg:mt-40  text-gray-800 leading-relaxed">

                {/* HERO SECTION */}
                <section
                    className="h-[90vh] bg-cover bg-center flex items-center justify-center text-center text-white"
                    style={{
                        backgroundImage:
                            `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('about.png')`,
                    }}
                >
                    <div className="max-w-3xl px-4 lg:px-6 ">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Crafting Quality. Stitching Trust.
                        </h1>
                        <p className="text-lg md:text-xl mb-6">
                            Premium Boho Style Garment Manufacturing & Exporting Since 2000
                        </p>
                        <a
                            href="#contact"
                            className="inline-block  bg-[#f59e7b] hover:bg-white cursor-pointer hover:text-[#f59e7b] border border-[#f59e7b] text-white px-8 py-3 rounded-full font-semibold transition"
                        >
                            Contact Us
                        </a>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section className="lg:p-20 p-6">
                    <div className="mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
                        <p className="text-lg text-gray-600">
                            <strong>SAVMISHA GLOBAL TRENDS</strong> is a leading clothing manufacturing
                            and export company, established in the year <strong>2000</strong> by
                            <strong> Mr. Sebati Ram</strong>. We specialize in the production of
                            boho-style garments, fashion bags, bedsheets, and textile products.
                            <br /><br />
                            With decades of industry experience and a commitment to quality,
                            we proudly serve international clients with stylish, durable,
                            and trend-focused apparel designed for global markets 😊.
                        </p>
                    </div>
                </section>

                {/* MISSION & VISION */}
                <section className="lg:p-20 bg-gray-100 p-6">
                    <div className=" grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow">
                            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                            <p className="text-gray-600">
                                Our mission is to manufacture high-quality garments and textile
                                products that combine comfort, creativity, and durability.
                                We aim to deliver consistent quality, timely delivery,
                                and complete customer satisfaction for every order.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow">
                            <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                            <p className="text-gray-600">
                                To become a globally recognized garment manufacturing brand,
                                known for ethical production practices, innovative designs,
                                and long-term partnerships with fashion businesses worldwide.
                            </p>
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE US */}
                <section className="lg:p-20 p-6">
                    <div className="text-center">
                        <h2 className="text-2xl lg:text-4xl font-bold mb-8">
                            Why Choose SAVMISHA GLOBAL TRENDS
                        </h2>
                        <ul className="max-w-xl mx-auto space-y-4 text-left">
                            {[
                                "Premium quality fabrics & materials",
                                "Experienced designers & skilled workforce",
                                "150+ unique garment & bag styles",
                                "Custom design & bulk order capability",
                                "Strict quality control at every stage",
                                "Reliable on-time global delivery",
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    className="bg-gray-100 p-4 rounded-lg"
                                >
                                    <span className=''>●</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* COMPANY STATS */}
                <section className="lg:p-20 bg-gray-50 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { label: "Clients", value: "17+" },
                            { label: "Products", value: "150+" },
                            { label: "Countries Served", value: "7+" },
                            { label: "Employees", value: "40+" },
                            // { label: "Branches", value: "2" },
                            // {
                            //   label: "Factory Types",
                            //   value: "Textile, Garments, Bedsheets, Bags",
                            // }

                        ].map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow">
                                <h3 className="text-2xl font-bold text-yellow-600 mb-2">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MANUFACTURING PROCESS */}
                <section className="lg:p-20 p-6">
                    <div className=" text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-10">
                            Our Manufacturing Process
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                "Design & Pattern Making",
                                "Fabric Cutting",
                                "Stitching & Assembly",
                                "Quality Inspection",
                                "Packaging & Export",
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-black text-white p-5 rounded-lg"
                                >
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 1 */}
                <section className=" lg:p-20 p-6 grid md:grid-cols-2 gap-12 items-center">

                    <img
                        src="about3.png"
                        className="rounded-xl shadow-lg"
                        alt="Garment factory"
                    />

                    <div>
                        <h2 className="text-4xl font-bold mb-6">
                            About Our Clothing Manufacturing
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            We are a trusted clothing manufacturing company dedicated to producing
                            high-quality garments for brands, wholesalers, and exporters. Our
                            mission is to combine creativity, craftsmanship, and modern
                            manufacturing techniques to deliver premium apparel that meets global
                            fashion standards. From design to production, our team ensures every
                            garment reflects quality, durability, and style.
                        </p>
                    </div>
                </section>


                {/* Section 2 */}
                <section className="bg-white">
                    <div className=" lg:p-20 p-6 grid md:grid-cols-2 gap-12 items-center">

                        <div>
                            <h2 className="text-4xl font-bold mb-6">
                                Our Manufacturing Strength
                            </h2>

                            <p className="text-gray-600 text-lg leading-relaxed">
                                Our manufacturing unit is equipped with advanced sewing machines,
                                professional tailoring teams, and strict quality control systems.
                                Every stage of the production process — from fabric sourcing to
                                stitching, finishing, and packaging — is carefully monitored to
                                ensure consistency and perfection. This allows us to handle both
                                small custom orders and large-scale bulk production efficiently.
                            </p>
                        </div>

                        <img
                            src="about2.png"
                            className="rounded-xl shadow-lg"
                            alt="Garment production"
                        />
                    </div>
                </section>


                <div className="w-full flex text-center justify-center lg:p-20 bg-gray-200">
                    <div className="p-6">
                        <p className="text-3xl lg:text-6xl font-bold text-yellow-600 mb-2">
                            Factory Types
                        </p>
                        <p className="text-gray-600 text-lg lg:text-xl">Textile, Garments, Bedsheets, Bags</p>
                    </div>
                </div>


                {/* Section 3 */}
                <section className="lg:p-20 p-6 grid md:grid-cols-2 gap-12 items-center">

                    <img
                        src="location.png"
                        className="rounded-xl shadow-lg"
                        alt="Delhi city"
                    />

                    <div>
                        <h2 className="text-4xl font-bold mb-6">
                            Our Location & Global Reach
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our company operates from the vibrant business hub of
                            <span className="font-semibold"> New Delhi, India</span>.
                            Being located in one of the country’s major textile and fashion
                            centers allows us to access premium fabrics, skilled artisans,
                            and efficient logistics networks. This strategic location enables
                            us to deliver high-quality garments to clients across India and
                            international markets with speed and reliability.
                        </p>
                    </div>
                </section>


                {/* Section 4 */}
                <section className="bg-gray-900 text-white">
                    <div className="lg:p-20 p-6 grid md:grid-cols-2 gap-12 items-center">

                        <div>
                            <h2 className="text-4xl font-bold mb-6">
                                Our Commitment to Quality
                            </h2>

                            <p className="text-gray-300 text-lg leading-relaxed">
                                We believe in building long-term partnerships with our clients by
                                delivering garments that meet the highest standards of quality and
                                craftsmanship. Whether you are starting a new fashion brand or
                                expanding an established clothing business, our team is committed
                                to turning your ideas into beautifully crafted apparel that your
                                customers will love.
                            </p>
                        </div>

                        <img
                            src=""
                            className="rounded-xl shadow-lg"
                            alt="Clothing products"
                        />
                    </div>
                </section>

                {/* LEADERSHIP */}
                <section className="lg:p-20 bg-gray-100 p-6">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-10">
                            Our Leadership
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow">
                                <h3 className="text-xl font-semibold">Mr. Sebati Ram</h3>
                                <p className="text-yellow-600 font-medium">Founder</p>
                                <p className="text-gray-600 mt-4">
                                    Founder of SAVMISHA GLOBAL TRENDS, bringing decades of
                                    experience in textile and garment manufacturing, focused
                                    on quality craftsmanship and ethical production.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow">
                                <h3 className="text-xl font-semibold">Ravi Kumar</h3>
                                <p className="text-yellow-600 font-medium">
                                    Co-Founder & Director
                                </p>
                                <p className="text-gray-600 mt-4">
                                    Leading the company with a global vision, innovation-driven
                                    strategies, and customer-focused manufacturing excellence.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <div>
                    <Footer />
                </div>

            </div>
        </div>
    );
};

export default About;