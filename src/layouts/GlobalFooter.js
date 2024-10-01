const Footer = ({ children }) => {
    return (
        <>
            <main>
                {children}
            </main>

            <footer>
                <p className="footer__signature">© 2024 - Ei Garçom</p>
            </footer>
        </>
    );
  };
  
  export default Footer;