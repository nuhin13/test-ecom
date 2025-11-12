export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Terms & Conditions</h1>

        <div className="card space-y-6">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">1. Introduction</h2>
            <p className="text-gray-700">
              Welcome to BD-Sourcing. By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">2. Use License</h2>
            <p className="text-gray-700 mb-3">
              Permission is granted to temporarily download one copy of the materials on BD-Sourcing's
              website for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>This is the grant of a license, not a transfer of title</li>
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for any commercial purpose</li>
              <li>You may not attempt to reverse engineer any software on BD-Sourcing</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">3. Product Information</h2>
            <p className="text-gray-700">
              We strive to provide accurate product information. However, we do not warrant that
              product descriptions or other content is accurate, complete, reliable, current, or
              error-free.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">4. Pricing</h2>
            <p className="text-gray-700">
              All prices are in USD and are subject to change without notice. We reserve the right to
              modify or discontinue products without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">5. Payment</h2>
            <p className="text-gray-700">
              Payment is required at the time of order. We accept major credit cards, debit cards, and
              cash on delivery where available.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">6. Shipping & Delivery</h2>
            <p className="text-gray-700 mb-3">
              We ship to addresses within Bangladesh. Delivery times are estimates and not guaranteed.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Standard delivery: 3-7 business days</li>
              <li>Express delivery: 1-3 business days (where available)</li>
              <li>Shipping costs are calculated at checkout</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">7. Returns & Refunds</h2>
            <p className="text-gray-700 mb-3">
              We offer a 7-day return policy on most items. Products must be unused and in original
              packaging.
            </p>
            <p className="text-gray-700">
              Refunds will be processed to the original payment method within 7-10 business days after
              we receive the returned item.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">8. Privacy Policy</h2>
            <p className="text-gray-700">
              Your privacy is important to us. We collect and use personal information only as needed
              to deliver our services. We do not sell or share your information with third parties
              except as required to process orders.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">9. Limitation of Liability</h2>
            <p className="text-gray-700">
              BD-Sourcing shall not be liable for any damages arising from the use or inability to use
              our website or products, even if we have been notified of the possibility of such
              damages.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">10. Contact Information</h2>
            <p className="text-gray-700">
              For questions about these Terms & Conditions, please contact us at:
            </p>
            <ul className="list-none text-gray-700 space-y-1 mt-3">
              <li>Email: support@bd-sourcing.com</li>
              <li>Phone: +880-1234-567890</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </section>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600">Last updated: January 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
