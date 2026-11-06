const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 py-8 px-4 md:mx-20 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-start
      md:items-center text-sm border-t border-gray-300">
      
      {/* Company Info */}
      <div className="mb-4 text-lg  md:mb-0 text-center md:text-left">
        <p>© Hehe Design</p>
      </div>

      

      {/* Contact Information */}
      <div className="mb-4 text-lg  md:mb-0 text-center md:text-left">
        <p>Southampton, Hampshire</p>
        <p className="mb-2">United Kingdom</p>
        <p>
          <a href="mailto:sunny.whe.design@gmail.com" className="hover:underline">
            sunny.whe.design@gmail.com
          </a>
        </p>
        <p>
          <a href="tel:+447388348419" className="hover:underline">
            +44 7388 348 419
          </a>
        </p>
      </div>

      {/* Follow Us & Social Links */}
      <div className="text-center  text-lg md:text-left">
        <div className="flex flex-wrap mt-4 justify-center md:justify-start space-x-4 text-2xl">
          <a
            href="https://api.whatsapp.com/send/?phone=447902478960&text&type=phone_number&app_absent=0"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Whatsapp
          </a>
          
          <span className="hidden md:inline">|</span>

          <a
            href="https://www.linkedin.com/in/sunny-weisheng-he/"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;