import "../styles/globals.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>Toddler Trainer</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export default Layout;