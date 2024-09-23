const MainLayout = ({ children }) => {
  return (
    <>
      <header>
        <h1>Ei Garçom</h1>
      </header>

      <main>
        {children}
      </main>

      <footer>
        <p>© 2024 - Seu Restaurante</p>
      </footer>
    </>
  );
};

export default MainLayout;
