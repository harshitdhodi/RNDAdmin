import React from "react"


const PrivacyPolicy = () => {
  return (
    <>
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-8 bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-gray-600 mb-6">
              VBRS has been serving the scientific community with the largest range of Laboratory Fine Chemicals &
              Dehydrated Culture Media since 1981. We insist upon superior quality and fastest service to enhance the
              trust of our valued customers.
            </p>

            <Section title="Our Product Range">
              <p>
                VBRS is presently manufacturing and marketing over 9000 products. The trust and belief of our customers
                make us more responsible in the aspect of quality. Our Quality Control and R & D departments are
                equipped with ultra-modern facilities to extract the best of it. We provide Quality with Quantity to
                fulfill the growing expectation of our customers.
              </p>
            </Section>

            <Section title="Innovation and Growth">
              <p>
                Idea, innovation, and invention are part of our company policy. This year has come with several
                consolidations of all. We are pleased to inform you that VBRS has introduced around 900 new products to
                meet the growing demand and your requirements, always aiming to be a part of your research.
              </p>
            </Section>

            <Section title="Quality and Standards">
              <p>
                VBRS is recognized as a benchmark for a wide range of high-purity products. We offer the best
                combination of:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Bio chemicals</li>
                <li>Research Chemicals</li>
                <li>Laboratory Reagents</li>
                <li>HPLC/AAS/EL/DRY Solvents</li>
                <li>Stains & Indicators</li>
                <li>Dehydrated Culture Media</li>
              </ul>
              <p className="mt-2">
                Our Analytical grade complies with the specifications of IP, BP, USP & EP grades. Our Dehydrated Culture
                Media products are manufactured and marketed under our brand name, awarded with CE certification to
                prove its quality at par with International Standards.
              </p>
            </Section>

            <Section title="Certifications">
              <p>
                VBRS is an ISO 9001: 2015 certified company in accordance with the Quality Management System. A quality
                manual and inspection documents define the processes and activities of our organization. We periodically
                monitor our services and performance, enabling us to constantly improve and update ourselves.
              </p>
            </Section>

            <Section title="Expansion">
              <p>
                VBRS has expanded its production capacity by setting up a second state-of-the-art manufacturing facility
                at Dahej, Gujarat. This facility competes with all International Industrial hubs across Asia. Key
                features include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Area spread over 35000 sqm (nearly 8.6 acres)</li>
                <li>Compliance with GMP standards</li>
                <li>Ultra-modern infrastructure</li>
                <li>Operational since July 2014</li>
                <li>6000 litres state-of-the-art facility for high purity solvents</li>
                <li>Storage capacity of 300000 litres of solvents</li>
              </ul>
            </Section>

            <Section title="Distribution Network">
              <p>
                VBRS products are widely available through a strong network of Super stockists, Stockists, and Sub
                Dealers spread globally. Supplying trustworthy, reliable products with fast delivery is our main
                objective.
              </p>
            </Section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                VBRS - A single stop solution for all of your laboratory needs.
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">Serving the scientific community since 1981</p>
            </div>
          </div>
        </div>
      </div>
 
    </>
  )
}

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed">{children}</div>
  </div>
)

export default PrivacyPolicy

