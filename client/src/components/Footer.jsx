import React from "react";
import logo from "../assets/log.png";
import { Link } from "react-router-dom";
import { assets } from "../assets/data";

const footerLinks = {
  company: [
    { label: "About",    href: "#" },
    { label: "Careers",  href: "#" },
    { label: "Press",    href: "#" },
    { label: "Blog",     href: "#" },
    { label: "Partners", href: "#" },
  ],
  support: [
    { label: "Help Center",          href: "#" },
    { label: "Safety Information",   href: "#" },
    { label: "Cancellation Options", href: "#" },
    { label: "Contact Us",           href: "/contact" },
    { label: "Accessibility",        href: "#" },
  ],
};

const socialIcons = [
  { src: assets.facebook,  alt: "Facebook"  },
  { src: assets.instagram, alt: "Instagram" },
  { src: assets.twitter,   alt: "Twitter"   },
  { src: assets.linkedin,  alt: "LinkedIn"  },
];

const FooterLinkList = ({ title, links }) => {
  return (
    <div>
      <p className="h5 text-black/80 uppercase tracking-wide">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="regular-14 text-gray-500 hover:text-secondary transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  // Fix scrollTo function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="pt-16 xl:pt-20 w-full bg-[#eefbff]">
      <div className="max-padd-container">
        <div className="flex flex-wrap justify-between gap-12 md:gap-6">

          {/* Brand Column */}
          <div className="max-w-72">
            <Link to="/" onClick={scrollToTop} className="inline-block mb-4">
              <img src={logo} alt="logo" className="h-11" />
            </Link>
            <p className="regular-14 text-gray-500 leading-relaxed">
              Find affordable student housing near your campus — safe, simple, and built for students.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialIcons.map((icon) => (
                <a
                  key={icon.alt}
                  href="#"
                  className="p-2 rounded-full bg-white hover:bg-secondary/10 ring-1 ring-slate-900/5 transition-all duration-200"
                >
                  <img src={icon.src} alt={icon.alt} width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <FooterLinkList title="Company" links={footerLinks.company} />

          {/* Support Links */}
          <FooterLinkList title="Support"  links={footerLinks.support}  />

          {/* Newsletter */}
          <div className="max-w-72">
            <p className="h5 text-black/80 uppercase tracking-wide">Stay Updated</p>
            <p className="regular-14 text-gray-500 mt-3 leading-relaxed">
              Get the latest student housing listings and tips delivered to your inbox.
            </p>
            <div className="flex items-center border pl-4 gap-2 bg-white border-gray-300 h-[46px] rounded-full overflow-hidden w-full mt-5">
              <input
                type="email"
                className="w-full h-full outline-none regular-13 text-gray-500 bg-transparent"
                placeholder="Your email address"
              />
              <button className="btn-secondary medium-13 !rounded-full !px-4 shrink-0">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <hr className="border-gray-300 mt-10" />
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
          <p className="regular-13 text-gray-400">
            © {new Date().getFullYear()} StudentNest. All rights reserved.
          </p>
          <ul className="flex items-center gap-4">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="regular-13 text-gray-400 hover:text-secondary transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;