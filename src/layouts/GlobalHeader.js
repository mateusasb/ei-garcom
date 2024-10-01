
const Header = ({ children }) => {
  return (
    <>
      <header>
        <h1 className="header__signature">Ei Garçom</h1>
      </header>

      <main>
        {children}
      </main>
    </>
  );
};

export default Header;
