import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen p-8 flex justify-center">
      <div className="bg-white/5 shadow-lg rounded-2xl p-8 my-20 max-w-3xl w-full space-y-6">
        <h1 className="heading mb-6 text-center">Terms of Service</h1>
        <p className="text-sm text-gray-400 text-center mb-12">
          Last updated: 04/10/2025
        </p>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Sierra Catalogue, you agree to comply with
            these Terms of Service. If you do not agree, please discontinue use
            of our platform immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">
            2. Use of the Platform
          </h2>
          <p>
            You agree to use Sierra Catalogue only for lawful purposes. You may
            not engage in activities that harm the platform, its users, or
            interfere with its proper operation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">
            3. User Accounts
          </h2>
          <p>
            To list a business or make purchases, you may need to create an
            account. You are responsible for maintaining the confidentiality of
            your account and for all activities under it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">
            4. Vendor Responsibilities
          </h2>
          <p>
            Vendors are solely responsible for the accuracy of their listings,
            product quality, pricing, and compliance with Sierra Leone laws and
            regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">5. Payments</h2>
          <p>
            Payments may be processed via supported local and international
            methods. Sierra Catalogue is not responsible for delays or errors
            caused by third-party payment providers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">
            6. Limitation of Liability
          </h2>
          <p>
            Sierra Catalogue acts as a platform to connect buyers and vendors.
            We are not liable for any direct, indirect, incidental, or
            consequential damages resulting from use of our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">
            7. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate your access if you
            violate these Terms of Service or engage in fraudulent, illegal, or
            abusive behavior.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">
            8. Changes to Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of Sierra
            Catalogue after updates means you accept the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-gold">9. Contact Us</h2>
          <p>
            For questions about these Terms, please contact us at{" "}
            <a
              href="mailto:sierracatalogue.business@gmail.com"
              className="text-primary-gold hover:underline"
            >
              sierracatalogue.business@gmail.com.
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
