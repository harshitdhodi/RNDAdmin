import React from "react"

const TermsAndConditions = () => {
  return (
    <>
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white mt-8 shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Terms and Conditions</h1>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-gray-600 mb-6">
              Welcome to VBRS. These Terms and Conditions govern your use of our website and services. By accessing or
              using VBRS's services, you agree to be bound by these Terms. Please read them carefully.
            </p>

            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using VBRS's services, you acknowledge that you have read, understood, and agree to be
                bound by these Terms and Conditions, as well as our Privacy Policy.
              </p>
            </Section>

            <Section title="2. Use of Services">
              <p>
                You agree to use VBRS's services only for lawful purposes and in accordance with these Terms. You are
                prohibited from:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Using our products for any illegal activities</li>
                <li>Misrepresenting the quality or origin of our chemicals</li>
                <li>Reselling our products without proper authorization</li>
                <li>Attempting to reverse engineer our proprietary formulations</li>
              </ul>
            </Section>

            <Section title="3. Product Usage and Safety">
              <p>
                VBRS provides high-quality laboratory chemicals and culture media. By purchasing our products, you agree
                to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the products only for their intended purpose</li>
                <li>Follow all safety guidelines and precautions provided</li>
                <li>Store and handle the products as per the instructions</li>
                <li>Not hold VBRS liable for any misuse or improper handling of products</li>
              </ul>
            </Section>

            <Section title="4. Intellectual Property Rights">
              <p>
                All content, formulations, logos, and materials on this website are the intellectual property of VBRS
                and are protected by copyright and other intellectual property laws. You may not use, reproduce, or
                distribute any content from this site without express written permission from VBRS.
              </p>
            </Section>

            <Section title="5. Limitation of Liability">
              <p>
                VBRS and its affiliates shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your access to or use of, or inability to access or use, our services or
                products. This limitation applies to all claims, whether based on warranty, contract, tort, or any other
                legal theory.
              </p>
            </Section>

            <Section title="6. Product Warranty">
              <p>
                VBRS warrants that our products meet the specifications stated in our product literature. If a product
                is found to be defective, our liability is limited to replacement of the product or refund of the
                purchase price. VBRS makes no other warranty, express or implied, including merchantability or fitness
                for a particular purpose.
              </p>
            </Section>

            <Section title="7. Modifications to Terms">
              <p>
                VBRS reserves the right to modify these Terms and Conditions at any time. We will provide notice of
                significant changes by posting an announcement on our website. Your continued use of our services after
                such modifications constitutes your acceptance of the updated Terms.
              </p>
            </Section>

            <Section title="8. Governing Law and Jurisdiction">
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any
                disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction
                of the courts located in Delhi, India.
              </p>
            </Section>

            <Section title="9. Severability">
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited
                or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force
                and effect and enforceable.
              </p>
            </Section>

            <Section title="10. Contact Information">
              <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
              <p className="mt-2">
                VBRS
                <br />
                Email: info@vbrs.com
                <br />
                Address: VBRS Chemicals Pvt Ltd, Plot No. 456, Industrial Area, Delhi-110092, India
              </p>
            </Section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                By using VBRS's services and products, you acknowledge that you have read and understood these Terms and
                Conditions and agree to be bound by them.
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">Last Updated: January 1, 2025</p>
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

export default TermsAndConditions

