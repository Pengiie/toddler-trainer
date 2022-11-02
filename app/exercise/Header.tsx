const Header = ({ title, subtitle }: { title: string, subtitle: string }) => {
  return <header className="flex flex-col justify-center items-center gap-2">
    <h1 className="text-6xl w-fit">{title}</h1>
    <h2 className="w-fit text-2xl">{subtitle}</h2>
  </header>;
}

export default Header;