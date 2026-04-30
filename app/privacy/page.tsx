import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Privacy Policy · StudyPuff",
  description: "How StudyPuff collects, uses, and protects your personal information."
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        subtitle="How studypuff.com collects, uses, and discloses your personal information."
        accent="sky"
      />

      <article className="prose-policy mx-auto max-w-3xl px-6 pb-24 lg:px-10">
        <p>
          This Privacy Policy describes how studypuff.com (the &ldquo;Site&rdquo; or &ldquo;we&rdquo;)
          collects, uses, and discloses your Personal Information when you visit or make a purchase
          from the Site.
        </p>

        <H2>Contact</H2>
        <p>
          After reviewing this policy, if you have additional questions, want more information about
          our privacy practices, or would like to make a complaint, please contact us by e-mail at{" "}
          <a href="mailto:info@studypuff.com">info@studypuff.com</a>.
        </p>

        <H2>Collecting personal information</H2>
        <p>
          When you visit the Site, we collect certain information about your device, your interaction
          with the Site, and information necessary to process your purchases. We may also collect
          additional information if you contact us for customer support. In this Privacy Policy, we
          refer to any information about an identifiable individual as &ldquo;Personal Information&rdquo;.
        </p>

        <H3>Device information</H3>
        <ul>
          <li>
            <strong>Purpose of collection:</strong> to load the Site accurately for you, and to perform
            analytics on Site usage to optimize our Site.
          </li>
          <li>
            <strong>Source of collection:</strong> collected automatically when you access our Site
            using cookies, log files, web beacons, tags, or pixels.
          </li>
          <li>
            <strong>Personal information collected:</strong> version of web browser, IP address, time
            zone, cookie information, what sites or products you view, search terms, and how you
            interact with the Site.
          </li>
        </ul>

        <H3>Order information</H3>
        <ul>
          <li>
            <strong>Purpose of collection:</strong> to provide products or services to you, to fulfil
            our contract, to process your payment information, arrange for shipping, and provide you
            with invoices and/or order confirmations, communicate with you, screen our orders for
            potential risk or fraud, and when in line with the preferences you have shared with us,
            provide you with information or advertising relating to our products or services.
          </li>
          <li>
            <strong>Source of collection:</strong> collected from you.
          </li>
          <li>
            <strong>Disclosure for a business purpose:</strong> shared with PostNL.
          </li>
          <li>
            <strong>Personal information collected:</strong> name, billing address, shipping address,
            payment information (including credit card numbers, debit card numbers, etc.), email
            address, and phone number.
          </li>
        </ul>

        <H2>Minors</H2>
        <p>
          The Site is not intended for individuals under the age of 18. We do not intentionally
          collect personal information from children. If you are the parent or guardian and believe
          your child has provided us with personal information, please contact us at the address
          above to request deletion.
        </p>

        <H2>Scientific research</H2>
        <p>
          We may use information collected through the Site, including email sign-ups, for
          scientific research purposes related to the development of educational tools and
          resources. Signing up for the mailing list does not mean your data will automatically be
          used for research. You will always be asked to provide your explicit consent before
          participating. Participation in research is entirely voluntary, and all data used for
          research will be anonymised or aggregated to ensure your privacy is protected. By signing
          up, you may receive invitations to participate in surveys or studies. You are free to
          decline or opt out at any time.
        </p>

        <H2>Sharing personal information</H2>
        <p>
          We share your personal information with service providers to help us provide our services
          and fulfil our contracts with you, as described above. For example, we may share your
          personal information to comply with applicable laws and regulations, to respond to a
          subpoena, search warrant or other lawful request for information we receive, or to
          otherwise protect our rights.
        </p>

        <H2>Using personal information</H2>
        <p>
          We use your personal information to provide our services to you, which includes: offering
          products for sale, processing payments, shipping and fulfilment of your order, and
          keeping you up to date on new products, services, and offers.
        </p>

        <H2>Lawful basis</H2>
        <p>
          Pursuant to the General Data Protection Regulation (&ldquo;GDPR&rdquo;), if you are a
          resident of the European Economic Area (&ldquo;EEA&rdquo;), we process your personal
          information under the following lawful bases:
        </p>
        <ul>
          <li>your consent;</li>
          <li>the performance of the contract between you and the Site;</li>
          <li>compliance with our legal obligations;</li>
          <li>for our legitimate interests, which do not override your fundamental rights and freedoms.</li>
        </ul>

        <H2>Retention</H2>
        <p>
          When you place an order through the Site, we will retain your personal information for our
          records unless and until you ask us to erase this information. For more information on
          your right of erasure, please see the &lsquo;Your rights&rsquo; section below.
        </p>

        <H2>Automatic decision-making</H2>
        <p>
          If you are a resident of the EEA, you have the right to object to processing based solely
          on automated decision-making (which includes profiling), when that decision-making has a
          legal effect on you or otherwise significantly affects you. Services that include elements
          of automated decision-making include: a temporary blacklist of IP addresses associated
          with repeated failed transactions (this blacklist persists for a small number of hours),
          and a temporary blacklist of credit cards associated with blacklisted IP addresses (this
          blacklist persists for a small number of days).
        </p>

        <H2>Your rights</H2>
        <H3>GDPR</H3>
        <p>
          If you are a resident of the EEA, you have the right to access the personal information we
          hold about you, to port it to a new service, and to ask that your personal information be
          corrected, updated, or erased. If you would like to exercise these rights, please contact
          us through the contact information above. Your personal information will be initially
          processed in The Netherlands.
        </p>
        <H3>CCPA</H3>
        <p>
          If you are a resident of California, you have the right to access the personal information
          we hold about you (also known as the &lsquo;Right to Know&rsquo;), to port it to a new
          service, and to ask that your personal information be corrected, updated, or erased. If
          you would like to exercise these rights, please contact us through the contact information
          above. If you would like to designate an authorised agent to submit these requests on your
          behalf, please contact us at the address above.
        </p>

        <H2>Cookies</H2>
        <p>
          A cookie is a small amount of information that&apos;s downloaded to your computer or
          device when you visit our Site. We use a number of different cookies, including
          functional, performance, advertising, and social media or content cookies. Cookies make
          your browsing experience better by allowing the website to remember your actions and
          preferences (such as login and region selection). This means you don&apos;t have to
          re-enter this information each time you return to the Site or browse from one page to
          another. Cookies also provide information on how people use the website.
        </p>
        <p>
          The length of time that a cookie remains on your computer or mobile device depends on
          whether it is a &ldquo;persistent&rdquo; or &ldquo;session&rdquo; cookie. Session cookies
          last until you stop browsing and persistent cookies last until they expire or are deleted.
          Most of the cookies we use are persistent and will expire between 30 minutes and two years
          from the date they are downloaded to your device.
        </p>
        <p>
          You can control and manage cookies in various ways. Please keep in mind that removing or
          blocking cookies can negatively impact your user experience and parts of our website may
          no longer be fully accessible. Most browsers automatically accept cookies, but you can
          choose whether or not to accept cookies through your browser controls, often found in your
          browser&apos;s &ldquo;Tools&rdquo; or &ldquo;Preferences&rdquo; menu.
        </p>

        <H2>Do not track</H2>
        <p>
          Please note that because there is no consistent industry understanding of how to respond
          to &ldquo;Do Not Track&rdquo; signals, we do not alter our data collection and usage
          practices when we detect such a signal from your browser.
        </p>

        <H2>Changes</H2>
        <p>
          We may update this Privacy Policy from time to time in order to reflect, for example,
          changes to our practices or for other operational, legal, or regulatory reasons.
        </p>

        <H2>Complaints</H2>
        <p>
          As noted above, if you would like to make a complaint, please contact us by e-mail using
          the details provided under &ldquo;Contact&rdquo; above. If you are not satisfied with our
          response to your complaint, you have the right to lodge your complaint with the relevant
          data protection authority. You can contact your local data protection authority.
        </p>

        <p className="mt-12 text-sm text-ink-700">Last updated: 04/06/2025</p>
      </article>
    </PageShell>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 font-display text-2xl text-ink-900">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 font-display text-lg text-ink-900">{children}</h3>;
}
